import React from "react";
import { formatPrice } from "../products";
import { Product } from "@/graphql/products";

const ItemData = ({
  title,
  imageUrl,
  price,
}: Omit<Product, "description" | "id" | "createdAt">) => {
  const formattedPrice = formatPrice(price);
  return (
    <div>
      <p className="cartItemTitle">{title}</p>
      <img className="cartImage" src={imageUrl} alt={title} />
      <p className="cartItemPrice">{formattedPrice}원</p>
    </div>
  );
};

export default ItemData;
