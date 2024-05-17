import { useInfiniteQuery } from "react-query";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import React, { useEffect, useRef } from "react";
import GET_PRODUCTS, { Products } from "@/graphql/products";
import ProductList from "@/components/ProductList";
import useIntersection from "@/hooks/useIntersection";

const ProductListPage = () => {
  const fetchMoreRef = useRef<HTMLDivElement>(null);
  const intersecting = useIntersection(fetchMoreRef);

  const { data, isSuccess, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<Products>(
      [QueryKeys.PRODUCTS, "products"],
      ({ pageParam = "" }) =>
        graphqlFetcher<Products>(GET_PRODUCTS, { cursor: pageParam }),
      {
        getNextPageParam: (lastPage) => {
          return lastPage.products.at(-1)?.id;
        },
      }
    );

  useEffect(() => {
    if (!intersecting || !hasNextPage || !isSuccess || isFetchingNextPage)
      return;
    fetchNextPage();
  }, [intersecting]);

  return (
    <div>
      <div className="productsPage">
        <div className="productsTitle">상품 목록</div>
        <ProductList list={data?.pages || []} />
        <div ref={fetchMoreRef} />
      </div>
    </div>
  );
};

export default ProductListPage;

export const formatPrice = (price: number) => {
  if (price) return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
