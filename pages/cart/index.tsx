import CartList from "@/components/CartList";
import { Cart, GET_CART } from "@/graphql/cart";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import React from "react";
import { useQuery } from "react-query";

const CartPage = () => {
  const { data } = useQuery<Cart[]>(QueryKeys.CART, () =>
    graphqlFetcher<Cart[]>(GET_CART)
  );
  const cartItems = Object.values(data || {});
  console.log(data);

  if (!cartItems.length) return <div>장바구니가 비었습니다</div>;

  return (
    <div>
      <CartList cartItems={cartItems} />
    </div>
  );
};

export default CartPage;
