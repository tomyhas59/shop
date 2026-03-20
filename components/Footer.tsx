import React from "react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="shop-footer">
      <div className="shop-footer__wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,0 C300,50 600,100 900,60 C1050,40 1150,20 1200,0 L1200,120 L0,120 Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>

      <div className="shop-footer__container">
        <div className="shop-footer__content">
          <div className="shop-footer__brand">
            <div className="shop-footer__logo">
              <div className="shop-footer__logo-icon">
                <i className="fas fa-store"></i>
              </div>
              <span>MyShop</span>
            </div>
            <p className="shop-footer__tagline">당신의 쇼핑을 더 특별하게</p>
            <div className="shop-footer__social">
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="shop-footer__links">
            <div className="shop-footer__column">
              <h3>쇼핑 정보</h3>
              <ul>
                <li>
                  <a href="#">회사 소개</a>
                </li>
                <li>
                  <a href="#">이용 약관</a>
                </li>
                <li>
                  <a href="#">개인정보처리방침</a>
                </li>
                <li>
                  <a href="#">청소년 보호정책</a>
                </li>
              </ul>
            </div>

            <div className="shop-footer__column">
              <h3>고객 지원</h3>
              <ul>
                <li>
                  <a href="#">공지사항</a>
                </li>
                <li>
                  <a href="#">자주 묻는 질문</a>
                </li>
                <li>
                  <a href="#">배송 조회</a>
                </li>
                <li>
                  <a href="#">반품/교환</a>
                </li>
              </ul>
            </div>

            <div className="shop-footer__column">
              <h3>문의하기</h3>
              <ul>
                <li>
                  <i className="fas fa-envelope"></i>
                  <span>yh9035926@naver.com</span>
                </li>
                <li>
                  <i className="fas fa-phone"></i>
                  <span>010-1234-1234</span>
                </li>
                <li>
                  <i className="fas fa-clock"></i>
                  <span>평일 09:00 - 18:00</span>
                </li>
                <li>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>서울시 강남구</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="shop-footer__bottom">
          <p>© {currentYear} MyShop. All rights reserved.</p>
          <p>
            Made with <i className="fas fa-heart"></i> in Korea
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
