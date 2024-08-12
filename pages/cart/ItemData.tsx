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
      <p className="cart-item-title">{title}</p>
      <img className="cart-image" src={imageUrl} alt={title} />
      <p className="cart-item-price">{formattedPrice}원</p>
    </div>
  );
};

export default ItemData;
