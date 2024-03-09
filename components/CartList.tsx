import { Cart } from "@/graphql/cart";
import CartItem from "./CartItem";

const CartList = ({ cartItems }: { cartItems: Cart[] }) => {
  return (
    <div>
      {cartItems.map((cartItem) => (
        <CartItem {...cartItem} key={cartItem.id} />
      ))}
    </div>
  );
};

export default CartList;
