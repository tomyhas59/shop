import React, { useState } from "react";
import Estimate from "../cart/Estimate";
import { useRecoilState } from "recoil";
import { checkedCartState } from "@/recolis/cart";
import PaymentModal from "@/components/ModalPortal";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { graphqlFetcher } from "@/queryClient";
import { EXECUTE_PAY } from "@/graphql/payment";

type PayInfo = {
  id: string;
  amount: number;
};

type PaymnetInfos = PayInfo[];

const Payment = () => {
  const router = useRouter();
  const [checkedCartData, setCheckedCartData] =
    useRecoilState(checkedCartState);
  const [modalShown, toggleModal] = useState(false);

  const { mutate: executePay } = useMutation((payInfos: PaymnetInfos) =>
    graphqlFetcher(EXECUTE_PAY, payInfos)
  );

  const showModal = () => {
    toggleModal(true);
  };
  const proceed = () => {
    const payInfos = checkedCartData.map(({ id, amount }) => ({ id, amount }));
    executePay(payInfos);
    router.replace("/products");
    setCheckedCartData([]);
  };
  const cancel = () => {
    toggleModal(false);
  };
  return (
    <div className="paymentWrapper">
      <Estimate />
      <button onClick={showModal}>결제하기</button>
      <PaymentModal show={modalShown} cancel={cancel} proceed={proceed} />
    </div>
  );
};

export default Payment;
