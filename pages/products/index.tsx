import ProductItem from "@/components/ProductItem";
import GET_PRODUCTS, { Products } from "@/graphql/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";

import React from "react";
import { useQuery } from "react-query";

const ProductList = () => {
  const { data } = useQuery<Products>(QueryKeys.PRODUCTS, () =>
    graphqlFetcher<Products>(GET_PRODUCTS)
  );

  console.log(data);
  return (
    <div>
      <div className="products-title">상품 목록</div>
      <ul className="productList">
        {data?.products?.map((product) => (
          <ProductItem {...product} key={product.id} />
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
