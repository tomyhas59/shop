import React, { ReactNode, useEffect } from "react";
import Spinner from "./Spinner";
import { useRecoilState } from "recoil";
import { loadingState } from "@/recolis/loading";
import { useRouter } from "next/router";

const Content = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useRecoilState(loadingState);

  const router = useRouter();

  useEffect(() => {
    // 페이지 이동 시작 시
    const handleRouteChangeStart = () => {
      setLoading(true);
    };

    // 페이지 이동 완료 시
    const handleRouteChangeComplete = () => {
      setLoading(false);
    };

    // 페이지 이동 에러 시
    const handleRouteChangeError = () => {
      setLoading(false);
    };

    // 페이지 라우터 이벤트에 리스너 등록
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeError);

    // 컴포넌트 언마운트 시 리스너 제거
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

export default Content;
