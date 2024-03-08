import ProductDetail from "@/components/ProductDetail";
import GET_PRODUCT, { Product } from "@/graphql/products";
import { QueryKeys, graphqlFetcher } from "@/queryClient";
import { useRouter } from "next/dist/client/router";

import React from "react";
import { useQuery } from "react-query";

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useQuery<Product>([QueryKeys.PRODUCTS, id], () =>
    graphqlFetcher<Product>(GET_PRODUCT, { id })
  );

  if (!data) return null;

  return (
    <div>
      <ProductDetail data={data} />
    </div>
  );
};

export default ProductDetailPage;
