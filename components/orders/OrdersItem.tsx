import { Cart } from "@/graphql/cart";
import { DELETE_ORDER } from "@/graphql/payment";
import { formatPrice } from "@/pages/products";
import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";
import { ForwardedRef, forwardRef } from "react";
import { useMutation } from "react-query";

const OrdersItem = (
  {
    id,
    createdAt,
    amount,
    product: { title, imageUrl, price },
    onCheckboxChange,
    isChecked,
    setIsChecked,
  }: Cart & {
    onCheckboxChange: (itemId: string, isChecked: boolean) => void;
    isChecked: boolean;
    setIsChecked: (checked: boolean) => void;
  },
  ref: ForwardedRef<HTMLInputElement>
) => {
  const queryClient = getClient();

  const { mutate: deleteOrder } = useMutation(
    (id: string) => graphqlFetcher(DELETE_ORDER, { id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.ORDERS); // 데이터 전체 다시 가져옴
      },
    }
  );

  const handleDeleteOrder = () => {
    deleteOrder(id);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsChecked(isChecked);
    onCheckboxChange(id, isChecked);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formattedTotalPrice = formatPrice(price * amount);

  return (
    <li className="order-card" data-checked={isChecked}>
      <span className="order-date">{formatDate(Number(createdAt))}</span>
      <button
        type="button"
        className="order-delete-button"
        onClick={handleDeleteOrder}
      >
        ✕
      </button>
      <div className="order-card-header">
        <input
          type="checkbox"
          id={`checkbox-${id}`}
          className="order-checkbox"
          ref={ref}
          data-id={id}
          disabled={!createdAt}
          onChange={handleCheckboxChange}
        />
      </div>
      <label htmlFor={`checkbox-${id}`} className="order-card-body">
        <img className="order-image" src={imageUrl} alt={title} />
        <div className="order-info">
          <p className="order-title">{title}</p>
          <p className="order-detail">수량: {amount}개</p>
          <p className="order-detail">개당: {formatPrice(price)}원</p>
          <p className="order-total">총 합계: {formattedTotalPrice}원</p>
        </div>
      </label>
    </li>
  );
};

export default forwardRef(OrdersItem);
