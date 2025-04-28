import React, { ReactNode, useEffect } from "react";
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
import Spinner from "../components/Spinner";
import { useRecoilState } from "recoil";
import { loadingState } from "@/recolis/loading";
import { useRouter } from "next/router";

interface PropTypes {
  Component: React.FC;
  pageProps: any /**SSR */;
}

const App: React.FC<PropTypes> = ({ Component, pageProps }) => {
  const queryClient = getClient();
  // 페이지를 벗어나거나 새로 고침 시 로그아웃 처리
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

const Content = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useRecoilState(loadingState);

  const router = useRouter();

  //페이지 이동 시 로딩
  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setLoading(false);
    };

    const handleRouteChangeError = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [router, setLoading]);

  return (
    <div className="content-wrapper">
      {loading && <Spinner />}
      {children}
    </div>
  );
};
