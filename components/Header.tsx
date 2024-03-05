import Link from "next/link";
import React from "react";

const Header = () => {
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
      </ul>
    </div>
  );
};

export default Header;
