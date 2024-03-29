import { useInfiniteQuery } from "react-query";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import React, { useEffect, useRef } from "react";
import GET_PRODUCTS, { Products } from "@/graphql/products";
import ProductList from "@/components/ProductList";
import useIntersection from "@/hooks/useIntersection";

const AdminPage = () => {
  const fetchMoreRef = useRef<HTMLDivElement>(null);
  const intersecting = useIntersection(fetchMoreRef);
  const { data, isSuccess, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<Products>(
      [QueryKeys.PRODUCTS, true],
      ({ pageParam = "" }) =>
        graphqlFetcher<Products>(GET_PRODUCTS, {
          cursor: pageParam,
          showDeleted: true,
        }),
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

  /* 
data: {
  {pageParams : [undefind...]},
  {pages: [
    {products:[{...}]},
    {products:[{...}]}
  ]}
}
 */

  /**
    전통적인 방식:
      -scrollTop + window.clinetHeight 등을 이용해서 정말 끝에 도달했는지 계산
      -eventHandler (scroll) => 감시. throttle / debounce => 쓰레드 메모리를 차지하고 성능에도 좋지 않다
    새로운 방식:
      -intersectionObserver
      -이벤트 등록 X, 브라우저에서 제공하는 별개의 감시자. 성능 탁월
   */

  return (
    <div>
      <div className="productWrapper">
        <div className="productsTitle">어드민</div>
        <ProductList list={data?.pages || []} />
        <div ref={fetchMoreRef} />
      </div>
    </div>
  );
};

export default AdminPage;

export const formatPrice = (price: number) => {
  return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
