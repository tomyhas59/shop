import { Cart } from "@/graphql/cart";
import { atom } from "recoil";

export const checkedCartState = atom<Cart[]>({
  key: "cartState",
  default: [],
});

/* export const cartItemSelector = selectorFamily<number | undefined, string>({
  key: "cartItem",
  get:
    (id: string) =>
    ({ get }) => {
      const carts = get(cartState);
      return carts[id];
    },
  set:
    (id: string) =>
    ({ get, set }, newValue) => {
      if (typeof newValue === "number") {
        console.log(newValue);
        set(cartState, {
          ...get(cartState),
          [id]: newValue,
        });
      }
    },
});
 */
