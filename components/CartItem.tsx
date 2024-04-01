import { Cart, DELETE_CART, UPDATE_CART } from "@/graphql/cart";
import ItemData from "@/pages/cart/ItemData";
import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";
import { ForwardedRef, SyntheticEvent, forwardRef } from "react";
import { useMutation } from "react-query";

const CartItem = (
  { id, product: { title, imageUrl, price, createdAt }, amount }: Cart,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const queryClient = getClient();

  const { mutate: updateCartAmount } = useMutation(
    ({ id, amount }: { id: string; amount: number }) =>
      graphqlFetcher<any>(UPDATE_CART, { id, amount }),
    {
      //서버 요청 전 실행으로 로컬 상태 변경
      onMutate: async ({ id, amount }) => {
        await queryClient.cancelQueries(QueryKeys.CART); //모든 이전 요청을 취소
        const cartData = queryClient.getQueryData<{ cart: Cart[] }>(
          QueryKeys.CART || []
        );
        if (!cartData) return null;

        const prevCart = cartData?.cart;
        const cartIndex = prevCart?.findIndex(
          (cartItem: any) => cartItem.id === id
        );
        if (cartIndex === undefined || cartIndex < 0) return prevCart;

        const newCart = [...prevCart];
        newCart.splice(cartIndex, 1, { ...newCart[cartIndex], amount });

        queryClient.setQueryData(QueryKeys.CART, { cart: newCart });
        return prevCart;
      },
      //서버 응답 후 실행
      onSuccess: ({ updateCart }) => {
        const cartData = queryClient.getQueryData<{ cart: Cart[] }>(
          QueryKeys.CART || []
        );

        const prevCart = cartData?.cart;
        const cartIndex = prevCart?.findIndex(
          (cartItem) => cartItem.id === updateCart.id
        );

        if (!prevCart || cartIndex === undefined || cartIndex < 0) return;
        const newCart = [...prevCart];
        newCart.splice(cartIndex, 1, updateCart);
        queryClient.setQueryData(QueryKeys.CART, { cart: newCart });
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
        disabled={!createdAt}
      />
      <ItemData imageUrl={imageUrl} price={price} title={title} />
      <div className="cartItemAmount">
        수량
        <input
          type="number"
          value={amount}
          onChange={handleUpdateAmount}
          disabled={!createdAt}
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
      {!createdAt && <div className="Xmark">삭제된 상품</div>}
    </li>
  );
};

export default forwardRef(CartItem);
