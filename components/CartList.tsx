import { Cart } from "@/graphql/cart";
import CartItem from "./CartItem";
import {
  createRef,
  useRef,
  SyntheticEvent,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { checkedCartState } from "@/recolis/cart";
import Estimate from "@/pages/cart/Estimate";
import { useRouter } from "next/router";
import { formatPrice } from "@/pages/products";

const CartList = ({ cartItems }: { cartItems: Cart[] }) => {
  const router = useRouter();

  const [checkedCartData, setCheckedCartData] =
    useRecoilState(checkedCartState);
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = cartItems.map(() => createRef<HTMLInputElement>());
  const [formData, setFormData] = useState<FormData>();
  const checkedItems = useRecoilValue(checkedCartState);

  const handleSubmit = () => {
    if (checkedItems.length) {
      router.push("/payment");
      // 새로운 경로로 이동하고 페이지 다시 로드
      // router.replace('/another-page');

      // 이전 페이지로 이동
      // router.back();
    }
  };

  //천 단위 쉼표-------------------------------
  const totalPrice = checkedItems.reduce(
    (res, { product: { price }, amount }) => {
      res += price * amount;
      return res;
    },
    0
  );

  const formattedTotalPrice = formatPrice(totalPrice);

  //개별 체크 올 체크 시------------------------------------------------
  const setAllCheckedFromItems = useCallback(() => {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const selectedCount = data.getAll("selectItem").length; //name="selectItem"
    const allChecked = selectedCount === cartItems.length;
    formRef.current.querySelector<HTMLInputElement>(".selectAll")!.checked =
      allChecked;
  }, [cartItems.length]);

  //올 체크 시-----------------------------------------------
  const setItemsCheckedFromAll = (targetInput: HTMLInputElement) => {
    const allChecked = targetInput.checked;
    checkboxRefs.forEach((inputElem) => {
      inputElem.current!.checked = allChecked;
    });
  };

  const handleCheckboxChanged = (e: SyntheticEvent) => {
    if (!formRef.current) return;
    const targetInput = e.target as HTMLInputElement;

    if (targetInput && targetInput.classList.contains("selectAll")) {
      setItemsCheckedFromAll(targetInput);
    } else {
      setAllCheckedFromItems();
    }
    const data = new FormData(formRef.current);
    setFormData(data);
  };

  //recoil checked 업데이트
  useEffect(() => {
    checkedCartData.forEach((item) => {
      const itemRef = checkboxRefs.find(
        (ref) => ref.current!.dataset.id === item.id
      );
      if (itemRef) itemRef.current!.checked = true;
    });
    setAllCheckedFromItems();
  }, []);

  //recoil data 추가
  useEffect(() => {
    const checkedItems = checkboxRefs.reduce<Cart[]>((res, ref, i) => {
      if (ref.current!.checked) res.push(cartItems[i]);
      return res;
    }, []);
    setCheckedCartData(checkedItems);
  }, [cartItems, formData]);

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
      <div className="buyWrapper">
        <p>총예상결제액</p>
        <p className="totalEstimate">{formattedTotalPrice}원</p>

        <button className="buy" onClick={handleSubmit}>
          구매하기
        </button>
      </div>
    </div>
  );
};

export default CartList;
