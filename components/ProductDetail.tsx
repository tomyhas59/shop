import { Product } from "@/graphql/products";
import React from "react";

const ProductDetail = ({
  data: { createAt, description, imageUrl, price, title, id },
}: {
  data: Product;
}) => {
  return (
    <div className="product-detail">
      <p className="category">{createAt}</p>
      <p className="title">{title}</p>
      <img className="image" src={imageUrl} alt={title} />
      <p className="description">{description}</p>
      <span className="price">{price}달러</span>
    </div>
  );
};

export default ProductDetail;
