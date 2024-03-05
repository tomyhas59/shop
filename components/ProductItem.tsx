import { Product } from "@/types";
import Link from "next/link";
import React from "react";

const ProductItem = ({
  category,
  description,
  image,
  price,
  rating,
  title,
  id,
}: Product) => {
  return (
    <Link className="product-item" href={`/products/${id}`}>
      <p className="category">{category}</p>
      <img className="image" src={image} alt={title} />
      <p className="title">{title}</p>
      <span className="price">{price}달러</span>
    </Link>
  );
};

export default ProductItem;

/*  
 category: "men's clothing"
description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday"
id: 1
image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
price: 109.95
rating: {rate: 3.9, count: 120}
title: "Fjallraven - Foldsack No. 1 Backpack, Fi
  */
