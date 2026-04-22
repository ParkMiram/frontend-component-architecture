// CustomButton
import React from "react";
import "../styles/button.scss";
import "../styles/button.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ButtonForm, PageButtonForm } from "../types/interface/ButtonForm";

// 기본 버튼
export const Button = ({
  width,
  height,
  color,
  children,
  ...props
}: ButtonForm) => {
  return (
    <button
      style={{
        width: width,
        height: height,
        color: color,
      }}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

// 페이지 버튼 박스 (페이지 버튼을 감쌈)
export const PageButtonBox = ({ children }: { children: React.ReactNode }) => {
  return <div className="page-button-box">{children}</div>;
};

// 페이지 버튼
export const PageButton = ({
  children,
  icon,
  className,
  ...props
}: PageButtonForm) => {
  return (
    <Button {...props} className={`page-button ${className ? className : ""}`}>
      {icon && <FontAwesomeIcon icon={icon} style={{ marginRight: "4px" }} />}
      {children}
    </Button>
  );
};

// 탭 버튼
export const TabButton = ({ children, ...props }: PageButtonForm) => {
  return <Button {...props}>{children}</Button>;
};

// 모달 버튼
export const ModalButton = ({
  children,
  className,
  ...props
}: PageButtonForm) => {
  return (
    <Button {...props} className={`modal-button ${className}`}>
      {children}
    </Button>
  );
};
