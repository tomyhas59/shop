import { Review } from "@/graphql/review";
import { atom } from "recoil";

export const reviewsState = atom<Review[]>({
  key: "reviewsState",
  default: [],
});
