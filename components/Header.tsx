import Link from "next/link";
import React from "react";
import { signOut } from "firebase/auth";
import auth from "@/firebaseConfig";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserProvider";
import Image from "next/image";
import mainLogo from "@/public/logo.png";

const Header = () => {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <header className="header">
      <Link href="/">
        <Image className="logo-img" src={mainLogo} alt="mainLogo" />
      </Link>
      <nav className="page-category">
        <ul className="page-category-list">
          <li className="page-category-item">
            <Link href="/products">상품 목록</Link>
          </li>

          {user ? (
            <>
              {user.displayName === "admin" && (
                <li className="page-category-item">
                  <Link href="/admin">상품 관리</Link>
                </li>
              )}
              <li className="page-category-item">
                <a onClick={() => navigateTo("/cart")}>장바구니</a>
              </li>
              <li className="page-category-item">
                <a onClick={() => navigateTo("/orders")}>주문 내역</a>
              </li>
              <li className="page-category-item">
                <button onClick={handleLogout}>로그아웃</button>
              </li>
              <li className="page-category-item">
                <Link href="/userInfo">내 정보</Link>
              </li>
            </>
          ) : (
            <>
              <li className="page-category-item">
                <Link href="/signIn">로그인</Link>
              </li>
              <li className="page-category-item">
                <button onClick={() => navigateTo("/signUp")}>회원가입</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
