/* eslint-disable @next/next/no-img-element */
import React from "react";
import { formatPrice } from "../products";
import { Product } from "@/graphql/products";

const ItemData = ({ title, imageUrl, price }: Product) => {
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
