import { Cart } from "@/graphql/cart";
import CartItem from "./CartItem";

const CartList = ({ cartItems }: { cartItems: Cart[] }) => {
  return (
    <>
      <div>
        <input type="checkbox" /> 전체 선택
      </div>
      <div className="cartList">
        {cartItems.map((cartItem) => (
          <CartItem {...cartItem} key={cartItem.id} />
        ))}
      </div>
    </>
  );
};

export default CartList;
