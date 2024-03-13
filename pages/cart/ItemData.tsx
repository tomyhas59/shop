import { Cart } from "@/graphql/cart";
import React from "react";

const ItemData = ({ title, imageUrl, price }: Omit<Cart, "id" | "amount">) => {
  return (
    <div>
      <p className="cartItemTitle">{title}</p>
      <img className="cartImage" src={imageUrl} alt={title} />
      <p className="cartItemPrice">{price}</p>
    </div>
  );
};

export default ItemData;
