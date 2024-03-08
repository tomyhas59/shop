import { useQuery } from "react-query";
import ProductItem from "@/components/ProductItem";
import GET_PRODUCTS, { Products } from "@/graphql/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import React from "react";

const ProductList = () => {
  const { data } = useQuery<Products>(QueryKeys.PRODUCTS, () =>
    graphqlFetcher<Products>(GET_PRODUCTS)
  );

  console.log("list", data);
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
