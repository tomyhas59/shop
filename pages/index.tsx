import Link from "next/link";
import React from "react";

const MainPage = () => {
  return (
    <div style={{ fontSize: "100px" }}>
      <div>MainPage</div>
      <Link href={"/products"}>상품 목록</Link>
    </div>
  );
};

export default MainPage;
