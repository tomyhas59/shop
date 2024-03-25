import { Product } from "@/graphql/products";
import React from "react";
import ProductItem from "./ProductItem";

const ProductList = ({
  list,
}: {
  list: {
    products: Product[];
  }[];
}) => {
  return (
    <ul className="productList">
      {list.map((page) =>
        page.products.map((product) => (
          <ProductItem {...product} key={product.id} />
        ))
      )}
    </ul>
  );
};

export default ProductList;
