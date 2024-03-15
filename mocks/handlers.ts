import {
  ADD_CART,
  Cart,
  DELETE_CART,
  GET_CART,
  UPDATE_CART,
} from "@/graphql/cart";
import { EXECUTE_PAY } from "@/graphql/payment";
import GET_PRODUCTS, { GET_PRODUCT } from "@/graphql/products";
import { graphql } from "msw";
import { v4 as uuid } from "uuid";

const mockProducts = (() =>
  Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1 + "",
    imageUrl: `https://picsum.photos/id/${i + 10}/200/200`,
    price: 50000,
    title: `임시상품${i + 1}`,
    description: `임시상품내용${i + 1}`,
    createAt: new Date(1646735500542 + i * 1000 * 60 * 60 * 10).toString(),
  })))();

let cartData: { [key: string]: Cart } = {};

export const handlers = [
  graphql.query(GET_PRODUCTS, (req, res, ctx) => {
    return res(
      ctx.data({
        products: mockProducts,
      })
    );
  }),
  graphql.query(GET_PRODUCT, (req, res, ctx) => {
    const productId = req.variables.id;
    const product = mockProducts.find((product) => product.id === productId);
    if (product) {
      return res(ctx.data(product));
    } else {
      return res(
        ctx.status(404),
        ctx.errors([{ message: "Product not found" }])
      );
    }
  }),
  graphql.query(GET_CART, (req, res, ctx) => {
    return res(ctx.data(cartData));
  }),

  graphql.mutation(ADD_CART, (req, res, ctx) => {
    const newData = { ...cartData };
    const id = req.variables.id;
    const productId = req.variables.id;
    const product = mockProducts.find((product) => product.id === productId);
    if (!product) {
      throw new Error("상품이 없습니다");
    }
    const newItem = {
      ...product,
      amount: (newData[id]?.amount || 0) + 1,
    };
    newData[id] = newItem;
    cartData = newData;

    return res(ctx.data(newItem));
  }),

  graphql.mutation(UPDATE_CART, (req, res, ctx) => {
    const newData = { ...cartData };
    const { id, amount } = req.variables;

    if (!newData[id]) {
      throw new Error("없는 데이터입니다");
    }
    const newItem = {
      ...newData[id],
      amount,
    };
    newData[id] = newItem;
    cartData = newData;
    return res(ctx.data(newItem));
  }),

  graphql.mutation(DELETE_CART, (req, res, ctx) => {
    const newData = { ...cartData };
    const { id } = req.variables;
    delete newData[id];
    cartData = newData;
    return res(ctx.data(id));
  }),

  graphql.mutation(EXECUTE_PAY, (req, res, ctx) => {
    const ids = req.variables;
    console.log(ids);
    ids.forEach((id: string) => delete cartData[id]);
    return res(ctx.data(ids));
  }),
];
