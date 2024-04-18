// src/components/App.tsx
import React from "react";
import { RecoilRoot } from "recoil";
import { QueryClientProvider } from "react-query";
import { getClient } from "@/queryClient";
import { UserProvider } from "../context/UserProvider";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../scss/index.scss";

interface PropTypes {
  Component: React.FC;
}

const App: React.FC<PropTypes> = ({ Component }) => {
  const queryClient = getClient();

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>shop</title>
      </Head>
      <UserProvider>
        <RecoilRoot>
          <div id="modal"></div>
          <div className="layoutWrapper">
            <Header />
            <QueryClientProvider client={queryClient}>
              <div className="contentWrapper">
                <Component />
              </div>
            </QueryClientProvider>
            <Footer />
          </div>
        </RecoilRoot>
      </UserProvider>
    </>
  );
};

export default App;
