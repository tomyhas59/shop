import { useUser } from "@/context/UserProvider";
import { Cart } from "@/graphql/cart";
import { EXECUTE_PAY } from "@/graphql/payment";
import { formatPrice } from "@/pages/products";
import { graphqlFetcher } from "@/queryClient";
import { checkedCartState } from "@/recolis/cart";
import { Dispatch, SetStateAction, useState } from "react";
import { useMutation } from "react-query";
import { useRecoilState } from "recoil";
import PaymentModal from "./ModalPortal";

const Payment = ({
  cartItems,
  setCartItems,
}: {
  cartItems: Cart[];
  setCartItems: Dispatch<SetStateAction<Cart[]>>;
}) => {
  const [checkedItems, setCheckedCartData] = useRecoilState(checkedCartState);
  const { user } = useUser();
  const uid = user?.uid;
  const [modalShown, toggleModal] = useState(false);

  //천 단위 쉼표-------------------------------
  const totalPrice = checkedItems.reduce(
    (res, { product: { price }, amount }) => {
      res += price * amount;
      return res;
    },
    0
  );

  const formattedTotalPrice = formatPrice(totalPrice);

  //결제--------------------------------------------
  const { mutate: executePay } = useMutation(
    ({ uid, ids }: { uid: string; ids: string[] }) =>
      graphqlFetcher(EXECUTE_PAY, { uid, ids })
  );

  const proceed = () => {
    const ids = checkedItems.map((item) => item.id);
    console.log(ids);
    if (uid) {
      executePay(
        { uid, ids },
        {
          onSuccess: () => {
            const remainingItems = cartItems.filter(
              (item) =>
                !checkedItems.find((checkedItem) => checkedItem.id === item.id)
            );
            setCartItems(remainingItems);
            setCheckedCartData([]);
            alert("결제가 완료되었습니다");
            toggleModal(false);
          },
          onError: () => {
            alert("삭제된 상품이 포함되어 결제를 진행할 수 없습니다");
          },
        }
      );
    }
  };

  const handleSubmit = () => {
    if (checkedItems.length < 1) {
      alert("구매할 상품을 선택하세요");
    } else showModal();
    // 새로운 경로로 이동하고 페이지 다시 로드
    // router.replace('/another-page');

    // 이전 페이지로 이동
    // router.back();
  };

  const showModal = () => {
    toggleModal(true);
  };

  const cancel = () => {
    toggleModal(false);
  };

  return (
    <div className="total-cost-wrapper">
      <h3>총 금액</h3>
      <div className="total-estimate">
        {formattedTotalPrice ? `${formattedTotalPrice}원` : null}
      </div>
      <button className="buy" onClick={handleSubmit}>
        구매하기
      </button>
      <PaymentModal
        show={modalShown}
        cancel={cancel}
        proceed={proceed}
        totalEstimate={formattedTotalPrice || "0"}
      />
    </div>
  );
};

export default Payment;
