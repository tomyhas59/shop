import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GET_ALLPRODUCTS, Product, Products } from "@/graphql/products";
import { graphqlFetcher } from "@/queryClient";
import { GetServerSideProps } from "next";
import Link from "next/link";

interface MainPageProps {
  selectedProducts: Product[];
}

const MainPage: React.FC<MainPageProps> = ({ selectedProducts = [] }) => {
  const settings = {
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: true,
    dots: true,
    pauseOnHover: true,
  };

  return (
    <div className="shop-main">
      {/* 히어로 섹션 */}
      <div className="shop-hero">
        <div className="shop-hero__content">
          <div className="shop-hero__badge">
            <i className="fas fa-sparkles"></i>
            <span>New Arrival</span>
          </div>
          <h1 className="shop-hero__title">
            오늘의 특별한
            <br />
            <span className="shop-hero__highlight">추천 상품</span>
          </h1>
          <p className="shop-hero__description">
            엄선된 상품들을 특별한 가격으로 만나보세요
          </p>
        </div>

        <div className="shop-hero__slider">
          {selectedProducts.length > 0 ? (
            <Slider {...settings} className="shop-slider">
              {selectedProducts.map(
                (product, i) =>
                  product.createdAt && (
                    <div key={i} className="shop-slide">
                      <Link
                        href={`/products/${product.id}`}
                        className="shop-slide__link"
                      >
                        <div className="shop-slide__image-wrapper">
                          <img
                            src={product.imageUrl}
                            alt={product.title}
                            className="shop-slide__image"
                          />
                          <div className="shop-slide__overlay">
                            <div className="shop-slide__badge">
                              <i className="fas fa-fire"></i>
                              <span>HOT</span>
                            </div>
                          </div>
                        </div>
                        <div className="shop-slide__content">
                          <h3 className="shop-slide__title">{product.title}</h3>
                          <div className="shop-slide__price">
                            <span className="shop-slide__price-amount">
                              {product.price?.toLocaleString()}원
                            </span>
                          </div>
                          <button className="shop-slide__btn">
                            <span>자세히 보기</span>
                            <i className="fas fa-arrow-right"></i>
                          </button>
                        </div>
                      </Link>
                    </div>
                  ),
              )}
            </Slider>
          ) : (
            <div className="shop-slide__empty">
              <i className="fas fa-box-open"></i>
              <p>추천 상품이 없습니다</p>
            </div>
          )}
        </div>
      </div>

      {/* 특징 섹션 */}
      <div className="shop-features">
        <div className="shop-feature">
          <div className="shop-feature__icon shop-feature__icon--purple">
            <i className="fas fa-shipping-fast"></i>
          </div>
          <h3 className="shop-feature__title">무료 배송</h3>
          <p className="shop-feature__text">
            5만원 이상 구매시
            <br />
            무료 배송 서비스
          </p>
        </div>

        <div className="shop-feature">
          <div className="shop-feature__icon shop-feature__icon--blue">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h3 className="shop-feature__title">안전 결제</h3>
          <p className="shop-feature__text">
            SSL 보안
            <br />
            안전한 결제 시스템
          </p>
        </div>

        <div className="shop-feature">
          <div className="shop-feature__icon shop-feature__icon--pink">
            <i className="fas fa-headset"></i>
          </div>
          <h3 className="shop-feature__title">24/7 고객지원</h3>
          <p className="shop-feature__text">
            언제든지
            <br />
            도움을 드립니다
          </p>
        </div>

        <div className="shop-feature">
          <div className="shop-feature__icon shop-feature__icon--orange">
            <i className="fas fa-undo-alt"></i>
          </div>
          <h3 className="shop-feature__title">30일 반품</h3>
          <p className="shop-feature__text">
            구매 후 30일 이내
            <br />
            무료 반품 가능
          </p>
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="shop-cta">
        <div className="shop-cta__content">
          <h2 className="shop-cta__title">지금 바로 쇼핑을 시작하세요!</h2>
          <p className="shop-cta__text">
            다양한 상품들이 여러분을 기다리고 있습니다
          </p>
          <Link href="/products" className="shop-cta__btn">
            <span>전체 상품 보기</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const data = await graphqlFetcher<Products>(GET_ALLPRODUCTS);
    const initialProducts = data.allProducts || [];
    const realProducts = initialProducts.filter(
      (product) => product.createdAt !== null,
    );
    const shuffledProducts = [...realProducts].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffledProducts.slice(0, 3);

    return {
      props: {
        selectedProducts,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        selectedProducts: [],
      },
    };
  }
};

export default MainPage;
