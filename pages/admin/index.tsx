import { useInfiniteQuery } from "react-query";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import React, { useEffect, useRef, useState } from "react";
import GET_PRODUCTS, { Products } from "@/graphql/products";
import useIntersection from "@/hooks/useIntersection";
import AddForm from "./AddForm";
import AdminList from "./AdminList";

const AdminPage = () => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const fetchMoreRef = useRef<HTMLDivElement>(null);
  const intersecting = useIntersection(fetchMoreRef);
  const { data, isSuccess, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery<Products>(
      [QueryKeys.PRODUCTS, "admin"],
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

  const startEdit = (index: number) => () => setEditingIndex(index);
  const doneEdit = () => setEditingIndex(null);

  return (
    <div>
      <div className="admin-page">
        <AddForm />
        <div className="products-title">어드민</div>
        <AdminList
          list={data?.pages || []}
          editingIndex={editingIndex}
          startEdit={startEdit}
          doneEdit={doneEdit}
        />
        <div ref={fetchMoreRef} />
      </div>
    </div>
  );
};

export default AdminPage;
