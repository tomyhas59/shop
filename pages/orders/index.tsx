import OrdersList from "@/components/orders/OrdersList";
import auth from "@/firebaseConfig";
import { Cart } from "@/graphql/cart";
import { GET_ORDERS } from "@/graphql/payment";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { checkedOrdersState } from "@/recolis/cart";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import Link from "next/link";

const OrdersPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [ordersItems, setOrdersItems] = useState<Cart[]>([]);
  const uid = user?.uid;
  const setCheckedItems = useSetRecoilState(checkedOrdersState);

  useEffect(() => {
    setCheckedItems([]);
  }, []);

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
    },
  );

  useEffect(() => {
    if (data) setOrdersItems(data.orders);
  }, [data]);

  const handleCheckboxChange = async (itemId: string, isChecked: boolean) => {
    await refetch();
    const updatedCartItems = ordersItems.map((item) =>
      item.id === itemId ? { ...item, checked: isChecked } : item,
    );
    setOrdersItems(updatedCartItems);
  };

  const latestItems = ordersItems.sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  if (!ordersItems.length) {
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <div className="orders-empty__icon">
            <i className="fas fa-receipt"></i>
          </div>
          <h2 className="orders-empty__title">주문 내역이 없습니다</h2>
          <p className="orders-empty__description">
            상품을 구매하시면 주문 내역을 확인할 수 있습니다
          </p>
          <Link href="/products" className="orders-empty__action">
            <i className="fas fa-shopping-bag"></i>
            <span>쇼핑하러 가기</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-page__container">
        <header className="orders-page__header">
          <div className="orders-page__title-group">
            <h1 className="orders-page__title">
              <i className="fas fa-box"></i>
              주문내역
            </h1>
            <span className="orders-page__count">{ordersItems.length}건</span>
          </div>
        </header>

        <OrdersList
          ordersItems={latestItems}
          setOrdersItems={setOrdersItems}
          onCheckboxChange={handleCheckboxChange}
        />
      </div>
    </div>
  );
};

export default OrdersPage;
