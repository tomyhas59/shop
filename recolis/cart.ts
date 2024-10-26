import { Cart } from "@/graphql/cart";
import { atom } from "recoil";

export const checkedCartState = atom<Cart[]>({
  key: "checkedCartState",
  default: [],
});

export const checkedOrdersState = atom<Cart[]>({
  key: "checkedOrdersState",
  default: [],
});
