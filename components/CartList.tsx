import { Cart, DELETE_ALL_CART } from "@/graphql/cart";
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
import { useMutation } from "react-query";
import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";

const CartList = ({ cartItems }: { cartItems: Cart[] }) => {
  const router = useRouter();
  const queryClient = getClient();
  const [checkedCartData, setCheckedCartData] =
    useRecoilState(checkedCartState);
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = cartItems.map(() => createRef<HTMLInputElement>());
  const [formData, setFormData] = useState<FormData>();
  const checkedItems = useRecoilValue(checkedCartState);

  const handleSubmit = () => {
    if (checkedItems.length < 1) {
      alert("구매할 상품을 선택하세요");
    } else router.push("/payment");
    // 새로운 경로로 이동하고 페이지 다시 로드
    // router.replace('/another-page');

    // 이전 페이지로 이동
    // router.back();
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
  const enabledItem = cartItems.filter((item) => item.product.createdAt);

  const setAllCheckedFromItems = useCallback(() => {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const selectedCount = data.getAll("selectItem").length; //name="selectItem"
    const allItemsSelected = selectedCount === enabledItem.length;

    const selectAllCheckbox =
      document.querySelector<HTMLInputElement>(".selectAll");

    if (selectAllCheckbox) {
      selectAllCheckbox.checked = allItemsSelected;
    }
  }, [cartItems.length]);

  //올 체크 시-----------------------------------------------
  const setItemsCheckedFromAll = (targetInput: HTMLInputElement) => {
    const allChecked = targetInput.checked;
    checkboxRefs
      .filter((inputElem) => {
        return !inputElem.current?.disabled;
      })
      .forEach((inputElem) => {
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

  //전체 카트 삭제
  const { mutate: deleteAllCart } = useMutation(
    () => graphqlFetcher(DELETE_ALL_CART),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QueryKeys.CART); //데이터 전체 다시 가져옴
      },
    }
  );

  const handleDeleteAllItem = (e: SyntheticEvent) => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (confirmed) {
      deleteAllCart();
    } else {
      e.preventDefault();
    }
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

  useEffect(() => {
    const selectAllCheckbox =
      document.querySelector<HTMLInputElement>(".selectAll");

    if (selectAllCheckbox) {
      if (enabledItem.length === 0) {
        selectAllCheckbox.disabled = true;
      } else {
        selectAllCheckbox.disabled = false;
      }
    }
  }, [enabledItem]);

  return (
    <div className="CartListWrapper">
      <form ref={formRef} onChange={handleCheckboxChanged}>
        <label>
          <input type="checkbox" className="selectAll" name="selectAll" />
          전체 선택
        </label>
        <button className="deleteAll" onClick={handleDeleteAllItem}>
          전체 삭제
        </button>
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
