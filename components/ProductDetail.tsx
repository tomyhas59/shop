import { Product } from "@/types";
import Link from "next/link";
import React from "react";

const ProductDetail = ({
  data: { category, description, image, price, rating, title },
}: {
  data: Product;
}) => {
  return (
    <li className="product-detail">
      <p className="category">{category}</p>
      <p className="title">{title}</p>
      <img className="image" src={image} alt={title} />
      <p className="description">{description}</p>
      <span className="rating">
        {rating.count}/{rating.rate}
      </span>
      <span className="price">{price}달러</span>
      <Link href="/products">뒤로</Link>
    </li>
  );
};

export default ProductDetail;
