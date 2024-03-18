import { Cart, DELETE_CART, UPDATE_CART } from "@/graphql/cart";
import ItemData from "@/pages/cart/ItemData";
import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";
import { ForwardedRef, SyntheticEvent, forwardRef } from "react";
import { useMutation } from "react-query";

const CartItem = (
  { id, product: { imageUrl, price, title }, amount }: Cart,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const queryClient = getClient();

  const { mutate: updateCartAmount } = useMutation(
    ({ id, amount }: { id: string; amount: number }) =>
      graphqlFetcher(UPDATE_CART, { id, amount }),
    {
      //서버 요청 전 실행으로 로컬 상태 변경
      onMutate: async ({ id, amount }) => {
        await queryClient.cancelQueries(QueryKeys.CART); //모든 이전 요청을 취소

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
      //서버 응답 후 실행
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
    updateCartAmount({ id, amount });
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
        data-id={id}
      />
      <ItemData imageUrl={imageUrl} price={price} title={title} id={""} description={""} createAt={""} product={{
        id: "",
        imageUrl: "",
        price: 0,
        title: "",
        description: "",
        createAt: ""
      }} />
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
