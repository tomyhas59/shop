import Link from "next/link";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import auth from "@/firebaseConfig";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserProvider";

const Header = () => {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
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
      <Link href={"/"} className="mainLogo">
        메인 로고
      </Link>
      <ul className="headerSign">
        <Link className="signInButton" href={"/"}>
          로그인
        </Link>
        <li className="signUpButton" onClick={goToSignUpPage}>
          회원가입
        </li>
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
