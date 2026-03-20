import { useUser } from "@/context/UserProvider";
import { ADD_CART, Cart, DELETE_CART, GET_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useRouter } from "next/router";

const ProductItem = ({ imageUrl, price, title, id, reviewsCount }: Product) => {
  const { user } = useUser();
  const uid = user?.uid;
  const router = useRouter();

  const { data, refetch } = useQuery<{ cart: Cart[] }>(
    [QueryKeys.CART, uid],
    () => {
      if (uid) return graphqlFetcher<{ cart: Cart[] }>(GET_CART, { uid });
      return Promise.resolve({ cart: [] });
    },
    {
      staleTime: 0,
      cacheTime: 1000,
    },
  );

  const cartIds = data?.cart ? data.cart.map((item) => item.product.id) : [];
  const isAddedToCart = cartIds.includes(id);
  const [addedCart, setAddedCart] = useState(isAddedToCart);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const { mutate: addCart } = useMutation(
    ({ uid, id }: { uid: string; id: string }) =>
      graphqlFetcher(ADD_CART, { uid, id }),
  );

  const { mutate: deleteCart } = useMutation((id: string) =>
    graphqlFetcher(DELETE_CART, { id }),
  );

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

  const goToProductDetail = () => {
    router.push(`/products/${id}`);
  };

  return (
    <li className="product-item" onClick={goToProductDetail}>
      <div className="product-item__image-wrapper">
        <img className="product-item__image" src={imageUrl} alt={title} />
        <div className="product-item__overlay">
          <button
            className={`product-item__cart-btn ${addedCart ? "added" : ""}`}
            onClick={handleCartData}
          >
            <i
              className={`fas fa-${addedCart ? "check" : "shopping-cart"}`}
            ></i>
            <span>{addedCart ? "담김" : "담기"}</span>
          </button>
        </div>
        {reviewsCount > 0 && (
          <div className="product-item__badge">
            <i className="fas fa-star"></i>
            <span>{reviewsCount}</span>
          </div>
        )}
      </div>

      <div className="product-item__content">
        <h3 className="product-item__title">{title}</h3>
        <div className="product-item__footer">
          <span className="product-item__price">{formattedPrice}원</span>
          <div className="product-item__reviews">
            <i className="fas fa-comment-dots"></i>
            <span>리뷰 {reviewsCount}</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ProductItem;
