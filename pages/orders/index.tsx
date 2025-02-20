import OrdersList from "@/components/OrdersList";
import auth from "@/firebaseConfig";
import { Cart } from "@/graphql/cart";
import { GET_ORDERS } from "@/graphql/payment";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { checkedCartState } from "@/recolis/cart";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";

const OrdersPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [ordersItems, setOrdersItems] = useState<Cart[]>([]);
  const uid = user?.uid;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const { data, refetch } = useQuery<{ orders: Cart[] }>(
    [QueryKeys.ORDERS, uid],
    () => {
      if (uid) return graphqlFetcher<{ orders: Cart[] }>(GET_ORDERS, { uid });
      else return Promise.resolve({ orders: [] });
    },
    {
      staleTime: 0,
      cacheTime: 1000,
    }
  );

  useEffect(() => {
    if (data) setOrdersItems(data.orders);
  }, [data]);

  const handleCheckboxChange = async (itemId: string, isChecked: boolean) => {
    // 체크박스가 변경될 때마다 데이터를 다시 불러오기
    await refetch();
    const updatedCartItems = ordersItems.map((item) =>
      item.id === itemId ? { ...item, checked: isChecked } : item
    );
    setOrdersItems(updatedCartItems);
  };

  if (!ordersItems.length)
    return <div className="empty-cart">주문 내역이 없습니다.</div>;

  return (
    <div className="orders-page">
      <h1 className="orders-title">주문 내역</h1>
      <OrdersList
        ordersItems={ordersItems}
        setOrdersItems={setOrdersItems}
        onCheckboxChange={handleCheckboxChange}
      />
    </div>
  );
};

export default OrdersPage;
