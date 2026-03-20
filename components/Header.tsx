import Link from "next/link";
import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import auth from "@/firebaseConfig";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserProvider";
import Image from "next/image";
import mainLogo from "@/public/logo.png";

const Header = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <header className={`shop-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="shop-header__container">
        <Link href="/" className="shop-header__logo">
          <span className="shop-header__logo-text">MyShop</span>
        </Link>

        <nav className={`shop-header__nav ${isMenuOpen ? "active" : ""}`}>
          <ul className="shop-header__menu">
            <li className="shop-header__menu-item">
              <Link href="/products" onClick={() => setIsMenuOpen(false)}>
                <i className="fas fa-th"></i>
                <span>전체상품</span>
              </Link>
            </li>

            {user ? (
              <>
                {user.displayName === "admin" && (
                  <li className="shop-header__menu-item shop-header__menu-item--admin">
                    <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                      <i className="fas fa-tools"></i>
                      <span>관리자</span>
                    </Link>
                  </li>
                )}
                <li className="shop-header__menu-item">
                  <a onClick={() => navigateTo("/cart")}>
                    <i className="fas fa-shopping-cart"></i>
                    <span>장바구니</span>
                  </a>
                </li>
                <li className="shop-header__menu-item">
                  <a onClick={() => navigateTo("/orders")}>
                    <i className="fas fa-box"></i>
                    <span>주문내역</span>
                  </a>
                </li>
                <li className="shop-header__menu-item shop-header__menu-item--user">
                  <Link href="/userInfo" onClick={() => setIsMenuOpen(false)}>
                    <div className="shop-header__avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <span>{user.displayName || "사용자"}</span>
                  </Link>
                </li>
                <li className="shop-header__menu-item">
                  <button
                    className="shop-header__btn shop-header__btn--logout"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt"></i>
                    <span>로그아웃</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="shop-header__menu-item">
                  <Link href="/signIn" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-sign-in-alt"></i>
                    <span>로그인</span>
                  </Link>
                </li>
                <li className="shop-header__menu-item">
                  <button
                    className="shop-header__btn shop-header__btn--primary"
                    onClick={() => navigateTo("/signUp")}
                  >
                    <i className="fas fa-user-plus"></i>
                    <span>회원가입</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>

        <button
          className={`shop-header__hamburger ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {isMenuOpen && (
        <div
          className="shop-header__overlay"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;
