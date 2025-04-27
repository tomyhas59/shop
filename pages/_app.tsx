import React, { useEffect } from "react";
import { RecoilRoot } from "recoil";
import { QueryClientProvider } from "react-query";
import { getClient } from "@/queryClient";
import { UserProvider } from "../context/UserProvider";
import Head from "next/head";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../scss/index.scss";
import auth from "@/firebaseConfig";
import { signOut } from "firebase/auth";
import Content from "@/components/Content";

interface PropTypes {
  Component: React.FC;
  pageProps: any /**SSR */;
}

const App: React.FC<PropTypes> = ({ Component, pageProps }) => {
  const queryClient = getClient();

  useEffect(() => {
    const handleBeforeUnload = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          await signOut(auth);
        } catch (error) {
          console.error("Logout failed:", error);
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>shop</title>
        <link rel="icon" href="/TMSIcon.ico" />
      </Head>
      <UserProvider>
        <RecoilRoot>
          <div id="modal"></div>
          <div className="layout-wrapper">
            <Header />
            <QueryClientProvider client={queryClient}>
              <Content>
                <Component {...pageProps} />
              </Content>
            </QueryClientProvider>
            <Footer />
          </div>
        </RecoilRoot>
      </UserProvider>
    </>
  );
};

export default App;
