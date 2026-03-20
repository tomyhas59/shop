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
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const queryClient = getClient();

  const { mutate: deleteOrder } = useMutation(
    (id: string) => graphqlFetcher(DELETE_ORDER, { id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.ORDERS);
      },
    },
  );

  const handleDelete = () => {
    if (window.confirm("이 주문을 삭제하시겠습니까?")) {
      deleteOrder(id);
    }
  };

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    onCheckboxChange(id, checked);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const itemPrice = formatPrice(price);
  const totalPrice = formatPrice(price * amount);

  return (
    <li className="order-record">
      <div className="order-record__header">
        <div className="order-record__date">
          <i className="fas fa-calendar-alt"></i>
          <span>{formatDate(Number(createdAt))}</span>
        </div>
        <button
          type="button"
          className="order-record__delete"
          onClick={handleDelete}
          aria-label="주문 삭제"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="order-record__body">
        <div className="order-record__select">
          <input
            type="checkbox"
            id={`order-${id}`}
            className="order-record__checkbox"
            name="selectItem"
            ref={ref}
            data-id={id}
            disabled={!createdAt}
            onChange={handleCheck}
          />
          <label htmlFor={`order-${id}`} className="order-record__check-label">
            <i className="fas fa-check"></i>
          </label>
        </div>

        <div className="order-record__image">
          <img src={imageUrl} alt={title} />
        </div>

        <div className="order-record__details">
          <h3 className="order-record__name">{title}</h3>
          <div className="order-record__info">
            <div className="order-record__info-item">
              <span className="order-record__info-label">수량</span>
              <span className="order-record__info-value">{amount}개</span>
            </div>
            <div className="order-record__info-item">
              <span className="order-record__info-label">단가</span>
              <span className="order-record__info-value">{itemPrice}원</span>
            </div>
          </div>
        </div>

        <div className="order-record__total">
          <span className="order-record__total-label">결제금액</span>
          <span className="order-record__total-value">{totalPrice}원</span>
        </div>
      </div>
    </li>
  );
};

export default forwardRef(OrdersItem);
