import request, { RequestDocument } from "graphql-request";
import { QueryClient } from "react-query";

type AnyOBJ = { [key: string]: any };

const isProduction = process.env.NEXT_PUBLICK_NODE_ENV === "production";
const BASE_URL = isProduction
  ? "https://nosy-hedgehog-tomyhas59.koyeb.app/graphql" // Production server URL
  : "http://localhost:8000/graphql"; // Development server URL

export const getClient = (() => {
  let client: QueryClient | null = null;
  return () => {
    if (!client)
      client = new QueryClient({
        // Cache and shorten request time
        defaultOptions: {
          queries: {
            cacheTime: 1000 * 60 * 60 * 24,
            staleTime: 1000 * 60,
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
          },
        },
      });
    return client;
  };
})();

export const graphqlFetcher = <T>(query: RequestDocument, variables = {}) =>
  request<T>(BASE_URL, query, variables);

export const QueryKeys = {
  PRODUCTS: "PRODUCTS",
  PRODUCT: "PRODUCT",
  CART: "CART",
  SIGN_UP: "SIHN_UP",
};
