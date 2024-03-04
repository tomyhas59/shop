import ProductDetail from "@/components/ProductDetail";
import { QueryKeys, fetcher } from "@/queryClient";
import { Product } from "@/types";

import { useParams } from "next/navigation";
import React from "react";
import { useQuery } from "react-query";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { data } = useQuery<Product>([QueryKeys.PRODUCTS, id], () =>
    fetcher({
      method: "GET",
      path: `/products/${id}`,
    })
  );

  if (!data) return null;

  return (
    <div>
      <ProductDetail data={data} />
    </div>
  );
};

export default ProductDetailPage;
