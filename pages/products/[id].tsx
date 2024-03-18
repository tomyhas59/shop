import ProductDetail from "@/components/ProductDetail";
import { GET_PRODUCT, Product } from "@/graphql/products";
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

  const item = data.product;

  return (
    <div>
      <ProductDetail
        product={{
          id: "",
          imageUrl: "",
          price: 0,
          title: "",
          description: "",
          createAt: "",
        }}
        {...item}
      />
    </div>
  );
};

export default ProductDetailPage;
