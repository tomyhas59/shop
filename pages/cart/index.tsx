import CartList from "@/components/carts/CartList";
import Payment from "@/components/orders/Payment";
import auth from "@/firebaseConfig";
import { Cart, GET_CART } from "@/graphql/cart";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { checkedCartState } from "@/recolis/cart";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useSetRecoilState } from "recoil";
import Link from "next/link";

const CartPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<Cart[]>([]);
  const uid = user?.uid;
  const setCheckedItems = useSetRecoilState(checkedCartState);

  useEffect(() => {
    setCheckedItems([]);
  }, []);

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
    },
  );

  useEffect(() => {
    if (data) setCartItems(data.cart);
  }, [data]);

  const handleCheckboxChange = async (itemId: string, isChecked: boolean) => {
    await refetch();
    const updatedCartItems = cartItems.map((item) =>
      item.id === itemId ? { ...item, checked: isChecked } : item,
    );
    setCartItems(updatedCartItems);
  };

  if (!cartItems.length) {
    return (
      <div className="cart-page">
        <div className="cart-empty-state">
          <div className="cart-empty-state__icon">
            <i className="fas fa-shopping-cart"></i>
          </div>
          <h2 className="cart-empty-state__title">장바구니가 비어있습니다</h2>
          <p className="cart-empty-state__description">
            마음에 드는 상품을 장바구니에 담아보세요
          </p>
          <Link href="/products" className="cart-empty-state__action">
            <i className="fas fa-shopping-bag"></i>
            <span>쇼핑 계속하기</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        <header className="cart-page__header">
          <div className="cart-page__title-group">
            <h1 className="cart-page__title">
              <i className="fas fa-shopping-cart"></i>
              장바구니
            </h1>
            <span className="cart-page__count">{cartItems.length}개</span>
          </div>
        </header>

        <div className="cart-page__content">
          <div className="cart-page__main">
            <CartList
              cartItems={cartItems}
              setCartItems={setCartItems}
              onCheckboxChange={handleCheckboxChange}
            />
          </div>
          <aside className="cart-page__sidebar">
            <Payment cartItems={cartItems} setCartItems={setCartItems} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
