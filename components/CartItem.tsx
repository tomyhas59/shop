import { Cart, DELETE_CART, UPDATE_CART } from "@/graphql/cart";
import ItemData from "@/pages/cart/ItemData";
import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";
import { LegacyRef, SyntheticEvent, forwardRef } from "react";
import { useMutation } from "react-query";

const CartItem = (
  { id, imageUrl, price, title, amount }: Cart,
  ref: LegacyRef<HTMLInputElement>
) => {
  const queryClient = getClient();
  const { mutate: updateCart } = useMutation(
    ({ id, amount }: { id: string; amount: number }) =>
      graphqlFetcher(UPDATE_CART, { id, amount }),
    {
      onMutate: async ({ id, amount }) => {
        await queryClient.cancelQueries(QueryKeys.CART);

        const prevCart = queryClient.getQueryData<{ [key: string]: Cart }>(
          QueryKeys.CART
        );
        if (!prevCart?.[id]) return prevCart;

        const newCart = {
          ...(prevCart || []),
          [id]: { ...prevCart[id], amount },
        };
        queryClient.setQueryData(QueryKeys.CART, newCart);
        return prevCart;
      },
      onSuccess: (newValue) => {
        const prevCart = queryClient.getQueryData<{ [key: string]: Cart }>(
          QueryKeys.CART
        );
        const newCart = {
          ...(prevCart || []),
          [id]: newValue,
        };
        queryClient.setQueryData(QueryKeys.CART, newCart);
      },
    }
  );

  const { mutate: deleteCart } = useMutation(
    (id: string) => graphqlFetcher(DELETE_CART, { id }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.CART); //데이터 전체 다시 가져옴
      },
    }
  );

  const handleUpdateAmount = (e: SyntheticEvent) => {
    const amount = Number((e.target as HTMLInputElement).value);
    if (amount < 1) return;
    updateCart({ id, amount });
  };

  const handledeleteItem = () => {
    deleteCart(id);
  };

  return (
    <li className="cartItem">
      <input
        type="checkbox"
        className="cartItemCheckbox"
        name="selectItem"
        ref={ref}
      />
      <ItemData imageUrl={imageUrl} price={price} title={title} />
      <div className="cartItemAmount">
        수량
        <input
          type="number"
          value={amount}
          onChange={handleUpdateAmount}
          min={1}
        />
      </div>
      <button
        type="button"
        className="cartItemDelete"
        onClick={handledeleteItem}
      >
        삭제
      </button>
    </li>
  );
};

export default forwardRef(CartItem);
