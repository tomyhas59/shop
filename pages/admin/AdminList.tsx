import { Product } from "@/graphql/products";
import React from "react";
import AdminItem from "./AdminItem";

const AdminList = ({
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
          <AdminItem {...product} key={product.id} />
        ))
      )}
    </ul>
  );
};

export default AdminList;
