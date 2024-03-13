import { Cart } from "@/graphql/cart";
import CartItem from "./CartItem";
import { createRef, useRef, SyntheticEvent, useEffect, useState } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { checkedCartState } from "@/recolis/cart";
import Estimate from "@/pages/cart/Estimate";
import { useRouter } from "next/router";

const CartList = ({ cartItems }: { cartItems: Cart[] }) => {
  const router = useRouter();

  const setCheckedCartData = useSetRecoilState(checkedCartState);
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = cartItems.map(() => createRef<HTMLInputElement>());
  const [formData, setFormData] = useState<FormData>();
  const checkedItems = useRecoilValue(checkedCartState);

  const formatPrice = (price: number) => {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const totalPrice = checkedItems.reduce((res, { price, amount }) => {
    res += price * amount;

    return res;
  }, 0);

  const formattedTotalPrice = formatPrice(totalPrice);

  const handleCheckboxChanged = (e: SyntheticEvent) => {
    if (!formRef.current) return;
    // const checkboxes =
    //   formRef.current.querySelectorAll<HTMLInputElement>(".cartItemCheckbox");
    const targetInput = e.target as HTMLInputElement;
    const data = new FormData(formRef.current);
    const selectedCount = data.getAll("selectItem").length; //name="selectItem"

    if (targetInput.classList.contains("selectAll")) {
      const allChecked = targetInput.checked;
      checkboxRefs.forEach((inputElem) => {
        inputElem.current!.checked = allChecked;
      });
    } else {
      const allChecked = selectedCount === cartItems.length;
      formRef.current.querySelector<HTMLInputElement>(".selectAll")!.checked =
        allChecked;
    }
    setFormData(data);
  };

  useEffect(() => {
    const checkedItems = checkboxRefs.reduce<Cart[]>((res, ref, i) => {
      if (ref.current!.checked) res.push(cartItems[i]);
      return res;
    }, []);
    setCheckedCartData(checkedItems);
  }, [cartItems, formData]);

  const handleSubmit = () => {
    if (checkedItems.length) {
      router.push("/payment");
      // 새로운 경로로 이동하고 페이지 다시 로드
      // router.replace('/another-page');

      // 이전 페이지로 이동
      // router.back();
    }
  };

  return (
    <div className="CartListWrapper">
      <form ref={formRef} onChange={handleCheckboxChanged}>
        <label>
          <input type="checkbox" className="selectAll" />
          전체 선택
        </label>
        <div className="cartList">
          {cartItems.map((cartItem, i) => (
            <CartItem {...cartItem} key={cartItem.id} ref={checkboxRefs[i]} />
          ))}
        </div>
      </form>
      <Estimate />
      <div className="paymentWrapper">
        <p>총예상결제액</p>
        <p className="totalEstimate">{formattedTotalPrice}원</p>

        <button className="payment" onClick={handleSubmit}>
          결제하기
        </button>
      </div>
    </div>
  );
};

export default CartList;
