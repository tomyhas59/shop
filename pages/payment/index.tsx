import React, { useState } from "react";
import Estimate from "../cart/Estimate";
import { useRecoilState } from "recoil";
import { checkedCartState } from "@/recolis/cart";
import PaymentModal from "@/components/ModalPortal";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { graphqlFetcher } from "@/queryClient";
import { EXECUTE_PAY } from "@/graphql/payment";

const Payment = () => {
  const router = useRouter();
  const [checkedCartData, setCheckedCartData] =
    useRecoilState(checkedCartState);
  const [modalShown, toggleModal] = useState(false);

  const { mutate: executePay } = useMutation((ids: string[]) =>
    graphqlFetcher(EXECUTE_PAY, { ids })
  );

  const showModal = () => {
    toggleModal(true);
  };
  const proceed = () => {
    const ids = checkedCartData.map(({ id }) => id);
    executePay(ids, {
      onSuccess: () => {
        setCheckedCartData([]);
        alert("결제가 완료되었습니다");
        router.replace("/products");
      },
    });
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
