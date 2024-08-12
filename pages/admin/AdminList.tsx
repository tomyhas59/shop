import { Product } from "@/graphql/products";
import React from "react";
import AdminItem from "./AdminItem";

const AdminList = ({
  list,
  startEdit,
  doneEdit,
  editingIndex,
}: {
  list: {
    products: Product[];
  }[];
  editingIndex: number | null;
  doneEdit: () => void;
  startEdit: (index: number) => () => void;
}) => {
  if (list)
    return (
      <ul className="product-list">
        {list.map((page) =>
          page.products.map((product, i) => (
            <AdminItem
              {...product}
              key={product.id}
              isEditing={editingIndex === i}
              startEdit={startEdit(i)}
              doneEdit={doneEdit}
            />
          ))
        )}
      </ul>
    );
};

export default AdminList;
