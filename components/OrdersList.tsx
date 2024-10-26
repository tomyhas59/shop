import { Cart } from "@/graphql/cart";
import {
  createRef,
  useRef,
  SyntheticEvent,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import { useRecoilState } from "recoil";
import { checkedOrdersState } from "@/recolis/cart";
import { useMutation } from "react-query";
import { graphqlFetcher } from "@/queryClient";
import OrdersItem from "./OrdersItem";
import { DELETE_ALL_ORDERS } from "@/graphql/payment";

const OrdersList = ({
  ordersItems,
  onCheckboxChange,
  setOrdersItems,
}: {
  ordersItems: Cart[];
  onCheckboxChange: (itemId: string, isChecked: boolean) => void;
  setOrdersItems: Dispatch<SetStateAction<Cart[]>>;
}) => {
  const [checkedItems, setCheckedCartData] = useRecoilState(checkedOrdersState);
  const formRef = useRef<HTMLFormElement>(null);
  const checkboxRefs = ordersItems.map(() => createRef<HTMLInputElement>());
  const [formData, setFormData] = useState<FormData>();
  const [itemCheckedStates, setItemCheckedStates] = useState<{
    [key: string]: boolean;
  }>(ordersItems.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}));
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  //개별 체크 올 체크 시------------------------------------------------
  const enabledItem = ordersItems.filter((item) => item.product.createdAt);

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
  }, [enabledItem.length]);

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
  const { mutate: deleteAllOrders } = useMutation(() =>
    graphqlFetcher(DELETE_ALL_ORDERS)
  );

  const handleDeleteAllItem = (e: SyntheticEvent) => {
    e.preventDefault();
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (confirmed) {
      deleteAllOrders();
      setOrdersItems([]);
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
      if (ref.current!.checked) res.push(ordersItems[i]);
      return res;
    }, []);
    setCheckedCartData(checkedItems);
  }, [formData, ordersItems]);

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

  return (
    <div className="order-list-container">
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
        <div className="order-list">
          {ordersItems.map((ordersItem, i) => (
            <OrdersItem
              {...ordersItem}
              key={ordersItem.id}
              ref={checkboxRefs[i]}
              onCheckboxChange={onCheckboxChange}
              isChecked={itemCheckedStates[ordersItem.id] || false}
              setIsChecked={(checked: boolean) =>
                setItemCheckedStates((prev) => ({
                  ...prev,
                  [ordersItem.id]: checked,
                }))
              }
            />
          ))}
        </div>
      </form>
    </div>
  );
};

export default OrdersList;
