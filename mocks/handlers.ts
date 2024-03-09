import { ADD_CART, Cart, GET_CART } from "@/graphql/cart";
import GET_PRODUCTS, { GET_PRODUCT } from "@/graphql/products";
import { graphql } from "msw";
import { v4 as uuid } from "uuid";

const mockProducts = (() =>
  Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1 + "",
    imageUrl: `https://picsum.photos/id/${i + 1}/200/200`,
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
    if (newData[id]) {
      newData[id] = {
        ...newData[id],
        amount: (newData[id].amount || 0) + 1,
      };
    } else {
      const productId = req.variables.id;
      const product = mockProducts.find((product) => product.id === productId);
      if (product) {
        console.log("상품 찾음");
        newData[id] = {
          ...product,
          amount: 1,
        };
      }
    }
    cartData = newData;
    return res(ctx.data(newData));
  }),
];
