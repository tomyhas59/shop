/* eslint-disable @next/next/no-img-element */
import { useUser } from "@/context/UserProvider";
import { ADD_CART, Cart, GET_CART } from "@/graphql/cart";
import { Product } from "@/graphql/products";
import { formatPrice } from "@/pages/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    refetch();
  }, [refetch]);

  const cartIds = data?.cart ? data.cart.map((item) => item.product.id) : [];
  const isAddedToCart = cartIds.includes(id);
  const [addedCart, setAddedCart] = useState(isAddedToCart);

  const handleAddToCart = () => {
    if (uid) {
      addCart({ uid, id });
      setAddedCart(true);
    } else alert("로그인이 필요합니다");
  };

  useEffect(() => {
    setAddedCart(isAddedToCart);
  }, [data, isAddedToCart]);

  const formatedPrice = formatPrice(price);

  const timestamp = Number(createdAt) * 1000; // Firebase 타임스탬프를 밀리초 단위로 변환
  const date = new Date(timestamp); // Date 객체로 변환

  return (
    <div>
      <div className="productDetail">
        <p className="title">{title}</p>
        <img className="image" src={imageUrl} alt={title} />
        <p className="description">{description}</p>
        <span className="price">{formatedPrice}원</span>
        <button className="addCart" onClick={handleAddToCart}>
          {addedCart ? "담기 완료" : "담기"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
