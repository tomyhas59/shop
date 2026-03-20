import ProductDetail from "@/components/products/ProductDetail";
import { GET_PRODUCT, Product } from "@/graphql/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { useQuery } from "react-query";

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data, isLoading } = useQuery<{ product: Product }>(
    [QueryKeys.PRODUCTS, id],
    () => graphqlFetcher<{ product: Product }>(GET_PRODUCT, { id }),
  );

  if (isLoading) {
    return (
      <div className="product-detail-page">
        <div className="product-detail-loading">
          <div className="product-detail-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <p>상품 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="product-detail-page">
      <ProductDetail {...data.product} />
    </div>
  );
};

export default ProductDetailPage;
