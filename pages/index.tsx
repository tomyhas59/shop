import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useQuery } from "react-query";
import { GET_ALLPRODUCTS, Product, Products } from "@/graphql/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { GetServerSideProps } from "next";
import Link from "next/link";

interface MainPageProps {
  initialProducts: Product[];
}

const MainPage: React.FC<MainPageProps> = ({ initialProducts = [] }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const [randomProducts, setRandomProducts] = useState<Product[]>([]);

  console.log(initialProducts);

  useEffect(() => {
    const shuffledProducts = [...initialProducts].sort(
      () => 0.5 - Math.random()
    );
    const selectedProducts = shuffledProducts.slice(0, 3);
    setRandomProducts(selectedProducts);
  }, [initialProducts]);

  return (
    <div className="mainPage">
      <h1 className="bannerTitle">오늘의 추천 상품!</h1>
      <Slider {...settings} className="bannerSlider">
        {randomProducts.map(
          (product) =>
            product.createdAt && (
              <div key={product.id}>
                <Link href={`/products/${product.id}`}>
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="bannerImg"
                  />
                </Link>
                <div className="bannerProductTitle">{product.title}</div>
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
    console.log(initialProducts);

    return {
      props: {
        initialProducts,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        initialProducts: [],
      },
    };
  }
};

export default MainPage;
