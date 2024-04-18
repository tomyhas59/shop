import { Cart, DELETE_CART, UPDATE_CART } from "@/graphql/cart";
import ItemData from "@/pages/cart/ItemData";
import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";
import { ForwardedRef, SyntheticEvent, forwardRef, useState } from "react";
import { useMutation } from "react-query";

const CartItem = (
  { id, product: { title, imageUrl, price, createdAt }, amount }: Cart,
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
  };

  const handleDecreaseAmount = () => {
    if (newAmount > 1) {
      const newAmountValue = newAmount - 1;
      setNewAmount(newAmountValue);
      updateCartAmount({ id, amount: newAmountValue });
    }
  };

  const handledeleteItem = () => {
    deleteCart(id);
  };

  return (
    <li className="cartItem">
      <div>
        <input
          type="checkbox"
          id={`checkbox-${id}`}
          className="cartItemCheckbox"
          name="selectItem"
          ref={ref}
          data-id={id}
          disabled={!createdAt}
        />
        <label htmlFor={`checkbox-${id}`} className="customCheckbox"></label>
      </div>
      <ItemData imageUrl={imageUrl} price={price} title={title} />
      <div className="cartItemAmount">
        수량:
        <input
          type="number"
          className="amountInput"
          value={newAmount}
          onChange={handleInputChange}
        />
        <span className="amountButton">
          <button type="button" onClick={handleDecreaseAmount}>
            ▼
          </button>
          <button type="button" onClick={handleIncrementAmount}>
            ▲
          </button>
        </span>
      </div>
      <button
        type="button"
        className="cartItemDelete"
        onClick={handledeleteItem}
      >
        X
      </button>
      {!createdAt && <div className="Xmark">삭제된 상품</div>}
    </li>
  );
};

export default forwardRef(CartItem);
