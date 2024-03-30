import { Product } from "@/graphql/products";
import React from "react";

const ProductList = ({
  list,
  Item,
}: {
  list: {
    products: Product[];
  }[];
  Item: ({ id, imageUrl, price, title }: Product) => JSX.Element;
}) => {
  return (
    <ul className="productList">
      {list.map((page) =>
        page.products.map((product) => <Item {...product} key={product.id} />)
      )}
    </ul>
  );
};

export default ProductList;
