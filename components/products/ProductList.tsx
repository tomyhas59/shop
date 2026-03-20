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
  if (!list || list.length === 0 || !list[0]?.products) {
    return (
      <div className="product-list-empty">
        <i className="fas fa-box-open"></i>
        <h3>상품이 없습니다</h3>
        <p>등록된 상품이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="product-list-wrapper">
      <ul className="product-list">
        {list.map((page, pageIndex) =>
          page.products.map((product) => (
            <ProductItem {...product} key={`${pageIndex}-${product.id}`} />
          )),
        )}
      </ul>
    </div>
  );
};

export default ProductList;
