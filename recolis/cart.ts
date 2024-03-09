import { atom, selectorFamily } from "recoil";

const cartState = atom<Record<string, number>>({
  key: "cartState",
  default: {},
});

export const cartItemSelector = selectorFamily<number | undefined, string>({
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
