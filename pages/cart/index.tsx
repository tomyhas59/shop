import CartList from "@/components/CartList";
import auth from "@/firebaseConfig";
import { Cart, GET_CART } from "@/graphql/cart";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

const CartPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const uid = user?.uid;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

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

  const cartItems = (data?.cart || []) as Cart[];
  console.log("카트", cartItems);
  if (!cartItems.length)
    return <div className="emptyCart">장바구니가 비었습니다</div>;

  return (
    <div className="cartPage">
      <CartList cartItems={cartItems} />
    </div>
  );
};

export default CartPage;
