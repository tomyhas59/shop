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
    <li className="order-item-container">
      <input
        type="checkbox"
        id={`checkbox-${id}`}
        className="order-item-checkbox"
        name="selectItem"
        ref={ref}
        data-id={id}
        disabled={!createdAt}
        onChange={handleCheckboxChange}
      />
      <label htmlFor={`checkbox-${id}`} className="order-item">
        <img className="order-image" src={imageUrl} alt={title} />
        <p className="order-item-title">{title}</p>
        <p>{amount}개</p>
        <p>개당 {formatPrice(price)}원</p>
        <p>합계 {formattedTotalPrice}원</p>
        <p>주문 날짜 {formatDate(Number(createdAt))}</p>
      </label>

      <button
        type="button"
        className="order-item-delete"
        onClick={handleDeleteOrder}
      >
        X
      </button>
    </li>
  );
};

export default forwardRef(OrdersItem);
