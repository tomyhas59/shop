import { useInfiniteQuery, useQuery } from "react-query";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import React from "react";
import GET_PRODUCTS, { Products } from "@/graphql/products";
import ProductList from "@/components/ProductList";

const ProductListPage = () => {
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<Products>(
    QueryKeys.PRODUCTS,
    ({ pageParam = "" }) =>
      graphqlFetcher<Products>(GET_PRODUCTS, { cursor: pageParam }),
    {
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.products.at(-1)?.id;
      },
    }
  );

  /* 
data: {
  {pageParams : [undefind...]},
  {pages: [
    {products:[{...}]},
    {products:[{...}]}
  ]}
}
 */

  return (
    <div>
      <div className="productWrapper">
        <div className="productsTitle">상품 목록</div>
        <ProductList list={data?.pages || []} />
      </div>
    </div>
  );
};

export default ProductListPage;

export const formatPrice = (price: number) => {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
