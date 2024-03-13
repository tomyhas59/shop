import { useRecoilValue } from "recoil";
import { checkedCartState } from "@/recolis/cart";
import React from "react";
import ItemData from "./ItemData";

const Estimate = () => {
  const checkedItems = useRecoilValue(checkedCartState);

  return (
    <ul className="estimate">
      {checkedItems.map(({ amount, imageUrl, title, price, id }) => (
        <li className="estimateData">
          <ItemData imageUrl={imageUrl} title={title} price={price} key={id} />
          <p>수량: {amount}</p>
          <p>금액: {amount * price}</p>
        </li>
      ))}
    </ul>
  );
};

export default Estimate;
