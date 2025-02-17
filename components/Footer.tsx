import React from "react";
import footerLogo from "@/public/logo2.png";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-logo">
        <Link href={"/"}>
          <Image className="logo-img" src={footerLogo} alt="footerLogo" />
        </Link>
      </div>
      <div className="footer-info">
        <div className="footer-item">이메일: yh9035926@naver.com</div>
        <div className="footer-item">전화번호: 010-1234-1234</div>
        <div className="footer-item">© 2024 MyShop. All rights reserved.</div>
      </div>
    </div>
  );
};

export default Footer;
