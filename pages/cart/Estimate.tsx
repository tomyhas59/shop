import { useRecoilValue } from "recoil";
import { checkedCartState } from "@/recolis/cart";
import React from "react";
import ItemData from "./ItemData";
import { formatPrice } from "../products";

const Estimate = () => {
  const checkedItems = useRecoilValue(checkedCartState);

  return (
    <ul className="estimate">
      {checkedItems.map(({ amount, imageUrl, title, price, id }) => {
        const formattedPrice = formatPrice(price * amount);
        return (
          <li className="estimateData" key={id}>
            <ItemData imageUrl={imageUrl} title={title} price={price} />
            <p>수량: {amount}</p>
            <p>금액: {formattedPrice}원</p>
          </li>
        );
      })}
    </ul>
  );
};

export default Estimate;
