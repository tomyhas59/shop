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
  if (!show) return null;

  return (
    <ModalPortal>
      <div className="payment-modal">
        <div className="payment-modal__overlay" onClick={cancel}></div>
        <div className="payment-modal__container">
          <div className="payment-modal__header">
            <div className="payment-modal__icon">
              <i className="fas fa-credit-card"></i>
            </div>
            <h3 className="payment-modal__title">결제 확인</h3>
            <button
              className="payment-modal__close"
              onClick={cancel}
              aria-label="닫기"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="payment-modal__body">
            <div className="payment-modal__info">
              <p className="payment-modal__text">결제하시겠습니까?</p>
              <div className="payment-modal__amount-box">
                <span className="payment-modal__label">총 결제금액</span>
                <span className="payment-modal__amount">{totalEstimate}원</span>
              </div>
            </div>

            <div className="payment-modal__notice">
              <i className="fas fa-info-circle"></i>
              <span>결제 후 주문 내역에서 확인할 수 있습니다</span>
            </div>
          </div>

          <div className="payment-modal__footer">
            <button
              className="payment-modal__button payment-modal__button--cancel"
              onClick={cancel}
            >
              <i className="fas fa-times"></i>
              <span>취소</span>
            </button>
            <button
              className="payment-modal__button payment-modal__button--confirm"
              onClick={proceed}
            >
              <i className="fas fa-check"></i>
              <span>결제하기</span>
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default PaymentModal;
