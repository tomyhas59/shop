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
import { useRecoilState } from "recoil";
import { checkedCartState } from "@/recolis/cart";
import { useRouter } from "next/router";
import { formatPrice } from "@/pages/products";
import { useMutation } from "react-query";
import { QueryKeys, getClient, graphqlFetcher } from "@/queryClient";
import { useUser } from "@/context/UserProvider";
import { EXECUTE_PAY } from "@/graphql/payment";
import PaymentModal from "./ModalPortal";

const CartList = ({
  cartItems,
  onCheckboxChange,
}: {
  cartItems: Cart[];
  onCheckboxChange: (itemId: string, isChecked: boolean) => void;
}) => {
  const router = useRouter();
  const queryClient = getClient();
  const [checkedItems, setCheckedCartData] = useRecoilState(checkedCartState);
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = cartItems.map(() => createRef<HTMLInputElement>());
  const [formData, setFormData] = useState<FormData>();
  const [itemCheckedStates, setItemCheckedStates] = useState<{
    [key: string]: boolean;
  }>(cartItems.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}));
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSubmit = () => {
    if (checkedItems.length < 1) {
      alert("구매할 상품을 선택하세요");
    } else showModal();
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
      document.querySelector<HTMLInputElement>(".select-all");

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
    setItemCheckedStates((prevStates) =>
      Object.keys(prevStates).reduce((acc, key) => {
        acc[key] = allChecked;
        return acc;
      }, {} as { [key: string]: boolean })
    );
    setSelectAllChecked(allChecked);
  };

  const handleCheckboxChanged = (e: SyntheticEvent) => {
    if (!formRef.current) return;
    const targetInput = e.target as HTMLInputElement;

    if (targetInput && targetInput.classList.contains("select-all")) {
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
    checkedItems.forEach((item) => {
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
      document.querySelector<HTMLInputElement>(".select-all");

    if (selectAllCheckbox) {
      if (enabledItem.length === 0) {
        selectAllCheckbox.disabled = true;
      } else {
        selectAllCheckbox.disabled = false;
      }
    }
  }, [enabledItem]);

  //결제--------------------------------------------
  const { user } = useUser();
  const uid = user?.uid;
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
    <div className="cart-list-container">
      <form ref={formRef} onChange={handleCheckboxChanged}>
        <div className="all-button">
          <label className="custom-select-all">
            <input
              id="select-all"
              type="checkbox"
              className="select-all"
              name="selectAll"
            />
            전체 선택
            <label htmlFor="select-all"></label>
          </label>
          <button className="delete-all" onClick={handleDeleteAllItem}>
            전체 삭제
          </button>
        </div>
        <div className="cart-list">
          {cartItems.map((cartItem, i) => (
            <CartItem
              {...cartItem}
              key={cartItem.id}
              ref={checkboxRefs[i]}
              onCheckboxChange={onCheckboxChange}
              isChecked={itemCheckedStates[cartItem.id] || false}
              setIsChecked={(checked: boolean) =>
                setItemCheckedStates((prev) => ({
                  ...prev,
                  [cartItem.id]: checked,
                }))
              }
            />
          ))}
        </div>
      </form>
      <div className="buy-wrapper">
        <p>총 금액</p>
        <p className="total-estimate">
          {formattedTotalPrice ? `${formattedTotalPrice}원` : null}
        </p>
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
    </div>
  );
};

export default CartList;
