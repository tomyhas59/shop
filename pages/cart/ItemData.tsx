import { Cart } from "@/graphql/cart";
import React from "react";
import { formatPrice } from "../products";

const ItemData = ({ title, imageUrl, price }: Omit<Cart, "id" | "amount">) => {
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
