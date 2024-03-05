import { Product } from "@/types";

import React from "react";

const ProductDetail = ({
  data: { category, description, image, price, rating, title },
}: {
  data: Product;
}) => {
  return (
    <div className="product-detail">
      <p className="category">{category}</p>
      <p className="title">{title}</p>
      <img className="image" src={image} alt={title} />
      <p className="description">{description}</p>
      <span className="rating">
        {rating.count}/{rating.rate}
      </span>
      <span className="price">{price}달러</span>
    </div>
  );
};

export default ProductDetail;
