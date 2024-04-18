/* eslint-disable @next/next/no-img-element */
import { useUser } from "@/context/UserProvider";
import { ADD_CART, Cart, GET_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { SyntheticEvent, useState } from "react";
import { useMutation, useQuery } from "react-query";

const ProductDetail = ({
  createdAt,
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

  const { data } = useQuery<{ cart: Cart[] }>(
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
  const [isAddedToCart, setIsAddedToCart] = useState(cartIds.includes(id));

  const handleAddToCart = (e: SyntheticEvent) => {
    if (!isAddedToCart) {
      if (uid) {
        addCart({ uid, id });
        setIsAddedToCart(true);
      }
    }
  };

  const formatedPrice = formatPrice(price);

  const timestamp = Number(createdAt) * 1000; // Firebase 타임스탬프를 밀리초 단위로 변환
  const date = new Date(timestamp); // Date 객체로 변환

  return (
    <div className="productDetailWrapper">
      <div className="productDetail">
        <p className="createdAt">{date.toLocaleDateString()}</p>
        <p className="title">{title}</p>
        <img className="image" src={imageUrl} alt={title} />
        <p className="description">{description}</p>
        <span className="price">{formatedPrice}원</span>
        <button className="addCart" onClick={handleAddToCart}>
          {isAddedToCart ? "담기 완료" : "담기"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
