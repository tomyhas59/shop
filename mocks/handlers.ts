import GET_PRODUCTS, { GET_PRODUCT } from "@/graphql/products";
import { graphql } from "msw";
import { v4 as uuid } from "uuid";

const mockProducts = Array.from({ length: 20 }).map((_, i) => ({
  id: uuid(),
  imageUrl: `https://picsum.photos/id/${i + 1}/200/200`,
  price: 50000,
  title: `임시상품${i + 1}`,
  description: `임시상품내용${i + 1}`,
  createAt: new Date(1646735500542 + i * 1000 * 60 * 60 * 10).toString(),
}));

export const handlers = [
  graphql.query(GET_PRODUCTS, (req, res, ctx) => {
    return res(
      ctx.data({
        products: mockProducts,
      })
    );
  }),
  graphql.query(GET_PRODUCT, (req, res, ctx) => {
    return res(ctx.data(mockProducts[0]));
  }),
];
