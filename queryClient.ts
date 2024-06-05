import request, { RequestDocument } from "graphql-request";
import { QueryClient } from "react-query";

const isProduction = process.env.NODE_ENV === "production";
const BASE_URL = isProduction
  ? "https://port-0-shop-server-rccln2llvsdixmg.sel5.cloudtype.app/graphql" // Production server URL
  : "http://localhost:7000/graphql"; // Development server URL

console.log(process.env.NODE_ENV);
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
