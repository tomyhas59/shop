import React, { ReactChild } from "react";
import { createPortal } from "react-dom";

type PaymentModalProps = {
  show: boolean;
  cancel: () => void;
  proceed: () => void;
};

const ModalPortal = ({ children }: { children: ReactChild }) => {
  return createPortal(children, document.getElementById("modal")!);
};

const PaymentModal = ({ show, proceed, cancel }: PaymentModalProps) => {
  return show ? (
    <ModalPortal>
      <div className="modal">
        <div className="modalInner">
          <p>정말 결제할까요?</p>
          <div>
            <button onClick={proceed}>예</button>
            <button onClick={cancel}>아니오</button>
          </div>
        </div>
      </div>
    </ModalPortal>
  ) : null;
};

export default PaymentModal;
