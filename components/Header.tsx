import Link from "next/link";
import React from "react";
import { signOut } from "firebase/auth";
import auth from "@/firebaseConfig";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserProvider";
import mainLogo from "@/public/logo.png";
import Image from "next/image";

const Header = () => {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error(error);
    }
  };

  const goToCart = () => {
    if (!user) {
      alert("로그인이 필요합니다");
      return;
    }
    router.replace("/cart");
  };

  const goToSignUpPage = () => {
    router.replace("/signUp");
  };

  return (
    <div className="header">
      <Link href={"/"}>
        <Image className="logoImg" src={mainLogo} alt="mainLogo" />
      </Link>
      <ul className="signWrapper">
        {user ? (
          <>
            <li className="signButton" onClick={handleLogout}>
              로그아웃
            </li>
            <Link className="signButton" href={"/userInfo"}>
              내 정보
            </Link>
          </>
        ) : (
          <>
            <Link className="signButton" href={"/signIn"}>
              로그인
            </Link>
            <li className="signButton" onClick={goToSignUpPage}>
              회원가입
            </li>
          </>
        )}
      </ul>
      <ul className="headerList">
        <li>
          <Link href={"/products"}>상품 목록</Link>
        </li>
        <li>
          <a onClick={goToCart}>장바구니</a>
        </li>
        {user ? (
          <>
            {user.displayName === "admin" && (
              <li>
                <Link href={"/admin"}>상품 관리</Link>
              </li>
            )}
          </>
        ) : null}
      </ul>
    </div>
  );
};

export default Header;
