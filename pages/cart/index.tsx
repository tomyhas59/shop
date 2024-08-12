import CartList from "@/components/CartList";
import auth from "@/firebaseConfig";
import { Cart, GET_CART } from "@/graphql/cart";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";

const CartPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const uid = user?.uid;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const { data, refetch } = useQuery<{ cart: Cart[] }>(
    [QueryKeys.CART, uid],
    () => {
      if (uid) return graphqlFetcher<{ cart: Cart[] }>(GET_CART, { uid });
      else return Promise.resolve({ cart: [] });
    },
    {
      staleTime: 0,
      cacheTime: 1000,
    }
  );

  useEffect(() => {
    if (data) setCartItems(data.cart);
  }, [data]);

  const handleCheckboxChange = async (itemId: string, isChecked: boolean) => {
    // 체크박스가 변경될 때마다 데이터를 다시 불러오기
    await refetch();
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, checked: isChecked } : item
    );
    setCartItems(updatedCartItems);
  };

  if (!cartItems.length)
    return <div className="empty-cart">장바구니가 비었습니다</div>;

  return (
    <div className="cart-page">
      <CartList cartItems={cartItems} onCheckboxChange={handleCheckboxChange} />
    </div>
  );
};

export default CartPage;
