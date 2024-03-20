import CartList from "@/components/CartList";
import { Cart, GET_CART } from "@/graphql/cart";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import React from "react";
import { useQuery } from "react-query";

const CartPage = () => {
  const { data } = useQuery<{ cart: Cart[] }>(
    QueryKeys.CART,
    () => graphqlFetcher<{ cart: Cart[] }>(GET_CART),
    {
      staleTime: 0, //데이터가 만료되자마자 새로운 데이터를 가져옮
      cacheTime: 1000, //1초 뒤 캐시 삭제
    }
  );
  const cartItems = (data?.cart || []) as Cart[];
  console.log(data);
  if (!cartItems.length)
    return <div className="emptyCart">장바구니가 비었습니다</div>;

  return (
    <div>
      <CartList cartItems={cartItems} />
    </div>
  );
};

export default CartPage;
