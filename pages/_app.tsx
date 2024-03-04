import { getClient } from "@/queryClient";
import Head from "next/head";
import React from "react";
import { QueryClientProvider } from "react-query";
import "../scss/index.scss";
interface PropTypes {
  Component: React.FC;
}

const Shop: React.FC<PropTypes> = ({ Component }) => {
  const queryClient = getClient();
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>shop</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component />
      </QueryClientProvider>
    </>
  );
};

export default Shop;
