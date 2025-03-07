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
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="main-page">
      <h1 className="banner-title">오늘의 추천 상품!</h1>
      <Slider {...settings} className="banner-slider">
        {selectedProducts.map(
          (product, i) =>
            product.createdAt && (
              <div key={i}>
                <Link href={`/products/${product.id}`}>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="banner-img"
                  />
                </Link>
                <div className="banner-product-title">{product.title}</div>
              </div>
            )
        )}
      </Slider>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const data = await graphqlFetcher<Products>(GET_ALLPRODUCTS);
    const initialProducts = data.allProducts || [];
    const realProducts = initialProducts.filter(
      (product) => product.createdAt !== null
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
