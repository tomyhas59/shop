import { useUser } from "@/context/UserProvider";
import { ADD_CART, Cart, DELETE_CART, GET_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import ReviewList from "../reviews/ReviewList";

const ProductDetail = ({
  description,
  imageUrl,
  price,
  title,
  id,
}: Product) => {
  const { user } = useUser();
  const uid = user?.uid;

  const { mutate: addCart } = useMutation(
    ({ uid, id }: { uid: string; id: string }) =>
      graphqlFetcher(ADD_CART, { uid, id })
  );

  const { mutate: deleteCart } = useMutation((id: string) =>
    graphqlFetcher(DELETE_CART, { id })
  );

  const { data, refetch } = useQuery<{ cart: Cart[] }>(
    [QueryKeys.CART, uid],
    () => {
      if (uid) return graphqlFetcher<{ cart: Cart[] }>(GET_CART, { uid });
      else {
        return Promise.resolve({ cart: [] });
      }
    },
    {
      staleTime: 0,
      cacheTime: 1000,
    }
  );

  const cartIds = data?.cart ? data.cart.map((item) => item.product.id) : [];
  const isAddedToCart = cartIds.includes(id);
  const [addedCart, setAddedCart] = useState(isAddedToCart);

  const findCartIdByProductId = (productId: string) => {
    const cartItem = data?.cart.find((item) => item.product.id === productId);
    return cartItem?.id;
  };

  const handleCartData = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!user) return alert("로그인이 필요합니다");
    if (uid) {
      if (!addedCart) {
        addCart({ uid, id });
        setAddedCart(true);
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

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <div className="product-detail">
        <div className="image-container">
          <img className="image" src={imageUrl} alt={title} />
        </div>
        <div className="info">
          <h2 className="title">{title}</h2>
          <p className="description">{description}</p>
          <span className="price">{formattedPrice}원</span>
          <button
            className={`add-cart ${addedCart ? "added" : ""}`}
            onClick={handleCartData}
          >
            {addedCart ? "담기 완료" : "담기"}
          </button>
        </div>
      </div>

      <ReviewList productId={id} />
    </>
  );
};

export default ProductDetail;
