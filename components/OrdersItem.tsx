import { Cart } from "@/graphql/cart";
import { DELETE_ORDERS } from "@/graphql/payment";

import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";
import { ForwardedRef, forwardRef, useState } from "react";
import { useMutation } from "react-query";

const OrdersItem = (
  {
    id,
    product: { title, imageUrl, price, createdAt },
    onCheckboxChange,
    setIsChecked,
  }: Cart & {
    onCheckboxChange: (itemId: string, isChecked: boolean) => void;
    isChecked: boolean;
    setIsChecked: (checked: boolean) => void;
  },
  ref: ForwardedRef<HTMLInputElement>
) => {
  const queryClient = getClient();

  const { mutate: deleteOrders } = useMutation(
    (id: string) => graphqlFetcher(DELETE_ORDERS, { id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.ORDERS); // 데이터 전체 다시 가져옴
      },
    }
  );

  const handledeleteCart = () => {
    deleteOrders(id);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsChecked(isChecked);
    onCheckboxChange(id, isChecked);
  };

  return (
    <li className="orders-item-container">
      <div className="orders-item-box">
        <input
          type="checkbox"
          id={`checkbox-${id}`}
          className="orders-item-checkbox"
          name="selectItem"
          ref={ref}
          data-id={id}
          disabled={!createdAt}
          onChange={handleCheckboxChange}
        />
        <label htmlFor={`checkbox-${id}`} className="orders-item">
          <p className="orders-item-title">{title}</p>
          <img className="orders-image" src={imageUrl} alt={title} />
        </label>
      </div>
      <div className="orders-item-options">
        <p>주문 날짜: {createdAt}</p>
        <button
          type="button"
          className="orders-item-delete"
          onClick={handledeleteCart}
        >
          X
        </button>
      </div>
    </li>
  );
};

export default forwardRef(OrdersItem);
