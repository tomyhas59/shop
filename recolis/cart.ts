import { Cart } from "@/graphql/cart";
import { atom } from "recoil";

export const checkedCartState = atom<Cart[]>({
  key: "cartState",
  default: [],
});

export const addedCartState = atom({
  key: "addedCartState",
  default: [],
});
