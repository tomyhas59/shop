import request, { RequestDocument } from "graphql-request";
import { QueryClient } from "react-query";

type AnyOBJ = { [key: string]: any };

export const getClient = (() => {
  let client: QueryClient | null = null;
  return () => {
    if (!client)
      client = new QueryClient({
        //캐시 및 요청 시간 단축
        defaultOptions: {
          queries: {
            cacheTime: 1000 * 60 * 60 * 24,
            staleTime: 1000 * 60, //160초 이상 업데이트 안 되면 데이터 가져옴
            refetchOnMount: false,
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
          },
        },
      });
    return client;
  };
})();

const BASE_URL = "https://nosy-hedgehog-tomyhas59.koyeb.app/graphql";

/* export const restFetcher = async ({
  method,
  path,
  body,
  params,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  params?: AnyOBJ;
  body?: AnyOBJ;
}) => {
  try {
    let url = `${BASE_URL}${path}`;
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Acess-Control-Aloow-Origin": BASE_URL,
      },
    };

    if (params) {
      const searchParams = new URLSearchParams(params);
      url += "?" + searchParams.toString();
    }
    if (body) fetchOptions.body = JSON.stringify(body);

    const res = await fetch(url, fetchOptions);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
  }
}; */

export const graphqlFetcher = <T>(query: RequestDocument, variables = {}) =>
  request<T>(BASE_URL, query, variables);

export const QueryKeys = {
  PRODUCTS: "PRODUCTS",
  PRODUCT: "PRODUCT",
  CART: "CART",
  SIGN_UP: "SIHN_UP",
};
