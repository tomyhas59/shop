import React, { useState } from "react";
import Estimate from "../cart/Estimate";
import { useRecoilState } from "recoil";
import { checkedCartState } from "@/recolis/cart";
import PaymentModal from "@/components/ModalPortal";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import { graphqlFetcher } from "@/queryClient";
import { EXECUTE_PAY } from "@/graphql/payment";
import { useUser } from "@/context/UserProvider";

const Payment = () => {
  const { user } = useUser();
  const uid = user?.uid;
  const router = useRouter();
  const [checkedItems, setCheckedCartData] = useRecoilState(checkedCartState);
  const [modalShown, toggleModal] = useState(false);

  const { mutate: executePay } = useMutation(
    ({ uid, ids }: { uid: string; ids: string[] }) =>
      graphqlFetcher(EXECUTE_PAY, { uid, ids })
  );

  const showModal = () => {
    toggleModal(true);
  };
  const proceed = () => {
    const ids = checkedItems.map((item) => item.id);
    console.log(ids);
    if (uid) {
      executePay(
        { uid, ids },
        {
          onSuccess: () => {
            setCheckedCartData([]);
            alert("결제가 완료되었습니다");
            router.replace("/products");
          },
          onError: () => {
            alert("삭제된 상품이 포함되어 결제를 진행할 수 없습니다");
            router.replace("/cart");
          },
        }
      );
    }
  };
  const cancel = () => {
    toggleModal(false);
  };
  return (
    <div className="paymentPage">
      <Estimate />
      <button onClick={showModal}>결제하기</button>
      <PaymentModal show={modalShown} cancel={cancel} proceed={proceed} />
    </div>
  );
};

export default Payment;
