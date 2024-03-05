import { getClient } from "@/queryClient";
import Head from "next/head";
import React, { useEffect } from "react";
import { QueryClientProvider } from "react-query";
import "../scss/index.scss";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <div className="layoutWrapper">
        <Header />
        <QueryClientProvider client={queryClient}>
          <div className="contentWrapper">
            <Component />
          </div>
        </QueryClientProvider>
        <Footer />
      </div>
    </>
  );
};

export default Shop;
