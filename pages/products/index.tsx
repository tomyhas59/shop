import { useInfiniteQuery } from "react-query";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import React, { useEffect, useRef } from "react";
import GET_PRODUCTS, { Products } from "@/graphql/products";
import ProductList from "@/components/products/ProductList";
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
      },
    );

  useEffect(() => {
    if (!intersecting || !hasNextPage || !isSuccess || isFetchingNextPage)
      return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, intersecting, isFetchingNextPage, isSuccess]);

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <div className="products-header-content">
            <h1 className="products-title">
              <i className="fas fa-shopping-bag"></i>
              <span>전체 상품</span>
            </h1>
            <p className="products-subtitle">다양한 상품을 만나보세요</p>
          </div>
          <div className="products-count">
            {data?.pages[0]?.products && (
              <span>
                {data.pages.reduce(
                  (acc, page) => acc + page.products.length,
                  0,
                )}
                개의 상품
              </span>
            )}
          </div>
        </div>

        <ProductList list={data?.pages || []} />

        <div ref={fetchMoreRef} className="products-loader">
          {isFetchingNextPage && (
            <div className="products-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <span>상품을 불러오는 중...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;

export const formatPrice = (price: number) => {
  if (price) return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
