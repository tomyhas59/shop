/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useQuery } from "react-query";
import { GET_ALLPRODUCTS, Product, Products } from "@/graphql/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";

const MainPage: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const { data } = useQuery<Products>(QueryKeys.PRODUCTS, () =>
    graphqlFetcher<Products>(GET_ALLPRODUCTS)
  );

  const [randomProducts, setRandomProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (data && data.allProducts) {
      const shuffledProducts = data.allProducts.sort(() => 0.5 - Math.random());
      const selectedProducts = shuffledProducts.slice(0, 3);
      setRandomProducts(selectedProducts);
    }
  }, [data]);

  return (
    <div className="mainPage">
      <h1 className="bannerTitle">오늘의 추천 상품!</h1>
      <Slider {...settings}>
        {randomProducts.map(
          (product) =>
            product.createdAt && (
              <div key={product.id}>
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="bannerImg"
                />
                <div className="bannerProductTitle">{product.title}</div>
              </div>
            )
        )}
      </Slider>
    </div>
  );
};

export default MainPage;
