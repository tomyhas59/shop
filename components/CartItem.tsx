import { Cart } from "@/graphql/cart";

const CartItem = ({ id, imageUrl, price, title, amount }: Cart) => {
  return (
    <div>
      <div>{id}</div>
      <div>{imageUrl}</div>
      <div>{price}</div>
      <div>{title}</div>
      amount: {amount}
    </div>
  );
};

export default CartItem;
