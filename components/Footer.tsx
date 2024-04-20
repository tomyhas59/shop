import React from "react";
import footerLogo from "@/public/logo2.png";
import Image from "next/image";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footerLogo">
        <Image className="logoImg" src={footerLogo} alt="footerLogo" />
      </div>
      <div className="footerInfo">
        <div className="footerList">이메일: yh9035926@naver.com</div>
        <div className="footerList">전화번호: 010-7170-5926</div>
        <div className="footerList">© 2024 MyShop. All rights reserved.</div>
      </div>
    </div>
  );
};

export default Footer;
