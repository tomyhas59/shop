/* eslint-disable @next/next/no-img-element */
import { useUser } from "@/context/UserProvider";
import { ADD_CART, Cart, DELETE_CART, GET_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import pullCartImg from "@/public/pullCart.png";
import emptyCartImg from "@/public/emptyCart.png";
import Image from "next/image";

const ProductItem = ({ imageUrl, price, title, id }: Product) => {
  const { user } = useUser();
  const uid = user?.uid;
  const queryClient = getClient();

  const { data, refetch } = useQuery<{ cart: Cart[] }>(
    [QueryKeys.CART, uid],
    () => {
      if (uid) return graphqlFetcher<{ cart: Cart[] }>(GET_CART, { uid });
      return Promise.resolve({ cart: [] });
    },
    {
      staleTime: 0,
      cacheTime: 1000,
    }
  );

  const cartIds = data?.cart ? data.cart.map((item) => item.product.id) : [];
  const isAddedToCart = cartIds.includes(id);
  const [addedCart, setAddedCart] = useState(isAddedToCart);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const { mutate: addCart } = useMutation(
    ({ uid, id }: { uid: string; id: string }) =>
      graphqlFetcher(ADD_CART, { uid, id })
  );

  const { mutate: deleteCart } = useMutation(
    (id: string) => graphqlFetcher(DELETE_CART, { id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.CART); // Refresh cart data
      },
    }
  );

  const findCartIdByProductId = (productId: string) => {
    const cartItem = data?.cart.find((item) => item.product.id === productId);
    return cartItem?.id;
  };

  const handleCartData = () => {
    if (!user) return alert("로그인이 필요합니다");
    if (uid) {
      if (!addedCart) {
        addCart({ uid, id });
      } else {
        const cartId = findCartIdByProductId(id);
        if (cartId) {
          deleteCart(cartId);
        }
      }
      setAddedCart(!addedCart);
    }
  };

  useEffect(() => {
    setAddedCart(isAddedToCart);
  }, [data, isAddedToCart]);

  const formattedPrice = formatPrice(price);

  return (
    <li className="product-item">
      <img className="image" src={imageUrl} alt={title} />
      <p className="title">{title}</p>
      <Link className="link" href={`/products/${id}`}>
        상세 보기
      </Link>
      <span className="price">{formattedPrice}원</span>
      <button className="add-to-cart" onClick={handleCartData}>
        <Image
          className="cart-icon"
          src={addedCart ? pullCartImg : emptyCartImg}
          alt={addedCart ? "Added to cart" : "Add to cart"}
        />
      </button>
    </li>
  );
};

export default ProductItem;
