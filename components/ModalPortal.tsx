import React, { ReactChild } from "react";
import { createPortal } from "react-dom";

type PaymentModalProps = {
  show: boolean;
  cancel: () => void;
  proceed: () => void;
  totalEstimate: string;
};

const ModalPortal = ({ children }: { children: ReactChild }) => {
  return createPortal(children, document.getElementById("modal")!);
};

const PaymentModal = ({
  show,
  proceed,
  cancel,
  totalEstimate,
}: PaymentModalProps) => {
  return show ? (
    <ModalPortal>
      <div className="modal">
        <div className="modal-inner">
          <p>
            총 <span style={{ color: "red" }}>{totalEstimate}</span>원입니다
          </p>
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
