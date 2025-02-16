import { Cart, DELETE_CART, UPDATE_CART } from "@/graphql/cart";
import { formatPrice } from "@/pages/products";
import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";
import { checkedCartState } from "@/recolis/cart";
import { ForwardedRef, forwardRef, useState } from "react";
import { useMutation } from "react-query";
import { useRecoilState } from "recoil";

const CartItem = (
  {
    id,
    product: { title, imageUrl, price, createdAt },
    amount,
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

  const [newAmount, setNewAmount] = useState(amount);

  const { mutate: updateCartAmount } = useMutation(
    ({ id, amount }: { id: string; amount: number }) =>
      graphqlFetcher<any>(UPDATE_CART, { id, amount })
  );

  const { mutate: deleteCart } = useMutation(
    (id: string) => graphqlFetcher(DELETE_CART, { id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.CART); // 데이터 전체 다시 가져옴
      },
    }
  );

  const [checkedItems, setCheckedItems] = useRecoilState(checkedCartState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setNewAmount(value);
      updateCartAmount({ id, amount: value });
    }
  };
  const handleIncrementAmount = () => {
    const newAmountValue = newAmount + 1;
    setNewAmount(newAmountValue);
    updateCartAmount({ id, amount: newAmountValue });

    const updatedItems = checkedItems.map((item) =>
      item.id === id ? { ...item, amount: newAmountValue } : item
    );
    setCheckedItems(updatedItems);
  };

  const handleDecreaseAmount = () => {
    if (newAmount > 1) {
      const newAmountValue = newAmount - 1;
      setNewAmount(newAmountValue);
      updateCartAmount({ id, amount: newAmountValue });

      const updatedItems = checkedItems.map((item) =>
        item.id === id ? { ...item, amount: newAmountValue } : item
      );
      setCheckedItems(updatedItems);
    }
  };

  const handleDeleteCart = () => {
    deleteCart(id);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsChecked(isChecked);
    onCheckboxChange(id, isChecked);
  };

  const checkedItem = checkedItems.find((item) => item.id === id);
  const checkedItemAmount = checkedItem ? checkedItem.amount : 0;
  const formattedPrice = formatPrice(price);
  const formattedTotalPrice = formatPrice(price * checkedItemAmount);
  return (
    <li className="cart-item-container">
      <div className="cart-item-box">
        <input
          type="checkbox"
          id={`checkbox-${id}`}
          className="cart-item-checkbox"
          name="selectItem"
          ref={ref}
          data-id={id}
          disabled={!createdAt}
          onChange={handleCheckboxChange}
        />
        <label htmlFor={`checkbox-${id}`} className="cart-item">
          <p className="cart-item-title">{title}</p>
          <img className="cart-image" src={imageUrl} alt={title} />
          <p className="cart-item-price">{formattedPrice}원</p>
        </label>
      </div>
      <div className="cart-item-options">
        <div className="cart-item-amount">
          <span>수량:</span>
          <input
            type="number"
            className="amount-input"
            value={newAmount}
            onChange={handleInputChange}
          />
        </div>
        <button
          type="button"
          className="cart-item-delete"
          onClick={handleDeleteCart}
        >
          X
        </button>
      </div>
      {isChecked && (
        <div className="cart-item-total">
          합계: {formattedTotalPrice}원
          <div className="amount-button">
            <button type="button" onClick={handleIncrementAmount}>
              +
            </button>
            <button type="button" onClick={handleDecreaseAmount}>
              -
            </button>
          </div>
        </div>
      )}
      {!createdAt && <div className="xMark">삭제된 상품</div>}
    </li>
  );
};

export default forwardRef(CartItem);
