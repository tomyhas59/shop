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

  const handleIncrementAmount = () => {
    const newAmountValue = newAmount + 1;
    setNewAmount(newAmountValue); // 증가 버튼 클릭 시 화면에 표시된 수량을 증가시킴
    updateCartAmount({ id, amount: newAmountValue }); // 서버에 새로운 수량 값을 전달
  };

  const handleDecreaseAmount = () => {
    if (newAmount > 1) {
      const newAmountValue = newAmount - 1;
      setNewAmount(newAmountValue); // 감소 버튼 클릭 시 화면에 표시된 수량을 감소시킴
      updateCartAmount({ id, amount: newAmountValue }); // 서버에 새로운 수량 값을 전달
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
        수량 {newAmount}
        <button type="button" onClick={handleDecreaseAmount}>
          ▼
        </button>
        <button type="button" onClick={handleIncrementAmount}>
          ▲
        </button>
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
