import { useQuery } from "react-query";
import ProductItem from "@/components/ProductItem";

import { QueryKeys, graphqlFetcher } from "@/queryClient";
import React from "react";
import GET_PRODUCTS, { Products } from "@/graphql/products";

const ProductList = () => {
  const { data } = useQuery<Products>(QueryKeys.PRODUCTS, () =>
    graphqlFetcher<Products>(GET_PRODUCTS)
  );

  console.log("list", data);
  return (
    <div className="productWrapper">
      <div className="productsTitle">상품 목록</div>
      <ul className="productList">
        {data?.products?.map((product) => (
          <ProductItem {...product} key={product.id} />
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
