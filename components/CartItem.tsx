import { Cart, DELETE_CART, UPDATE_CART } from "@/graphql/cart";
import ItemData from "@/pages/cart/ItemData";
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
  }: Cart & {
    onCheckboxChange: (itemId: string, isChecked: boolean) => void;
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

  const handleChangeAmount = () => {
    if (newAmount > 1) {
      const updatedItems = checkedItems.map((item) =>
        item.id === id ? { ...item, amount: newAmount } : item
      );
      setCheckedItems(updatedItems);
    }
  };

  const handledeleteCart = () => {
    deleteCart(id);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    onCheckboxChange(id, isChecked);
  };

  return (
    <li className="cart-item">
      <div>
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
        <label htmlFor={`checkbox-${id}`} className="custom-checkbox"></label>
      </div>
      <ItemData imageUrl={imageUrl} price={price} title={title} />
      <div className="cart-item-amount">
        <span>수량:</span>
        <input
          type="number"
          className="amount-input"
          value={newAmount}
          onChange={handleInputChange}
        />
        <div className="amount-button">
          <button type="button" onClick={handleIncrementAmount}>
            ▲
          </button>
          <button type="button" onClick={handleDecreaseAmount}>
            ▼
          </button>
        </div>
        <button
          type="button"
          className="change-amount"
          onClick={handleChangeAmount}
        >
          변경
        </button>
      </div>
      <button
        type="button"
        className="cart-item-delete"
        onClick={handledeleteCart}
      >
        X
      </button>
      {!createdAt && <div className="xmark">삭제된 상품</div>}
    </li>
  );
};

export default forwardRef(CartItem);
