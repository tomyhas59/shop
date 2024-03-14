import { useQuery } from "react-query";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import React from "react";
import GET_PRODUCTS, { Products } from "@/graphql/products";
import ProductList from "@/components/ProductList";

const ProductListPage = () => {
  const { data } = useQuery<Products>(QueryKeys.PRODUCTS, () =>
    graphqlFetcher<Products>(GET_PRODUCTS)
  );

  return (
    <div>
      <div className="productWrapper">
        <div className="productsTitle">상품 목록</div>
        <ProductList list={data?.products || []} />
      </div>
    </div>
  );
};

export default ProductListPage;

export const formatPrice = (price: number) => {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
