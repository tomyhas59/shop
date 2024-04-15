import Link from "next/link";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import auth from "@/firebaseConfig";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="header">
      <ul className="headerList">
        <li>
          <Link href={"/products"}>상품 목록</Link>
        </li>
        <li>
          <Link href={"/"}>메인</Link>
        </li>
        <li>
          <Link href={"/cart"}>장바구니</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link href={"/userInfo"}>내 정보</Link>
            </li>
            <li>로그아웃</li>
          </>
        ) : null}
      </ul>
    </div>
  );
};

export default Header;
