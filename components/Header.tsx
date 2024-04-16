import Link from "next/link";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import auth from "@/firebaseConfig";
import { useRouter } from "next/router";

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
            {user.displayName === "admin" && (
              <li>
                <Link href={"/admin"}>상품 관리</Link>
              </li>
            )}
            <li className="signOut" onClick={handleLogout}>
              로그아웃
            </li>
          </>
        ) : null}
      </ul>
    </div>
  );
};

export default Header;
