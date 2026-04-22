import React from "react";

export type ModalPropsType = {
  onSuccess?: () => void;
  row?: any;
  userId?: string;
  handleModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading?: boolean;
};

export type ModalType = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  config: {
    title: string;
    content: React.JSX.Element;
    footer?: React.JSX.Element;
    closeButton?: string;
    confirmButton?: string;
    formId: string;
    loading?: boolean;
    disabled?: boolean;
    onRequestClose?: () => any;
    closePopover?: {
      title: string;
      description?: string;
    };
  } | null;
};

export type AppError = {
  url?: string; // 메시지로 쓰는 경우가 있음
  code?: string | number; // "401", "SP8001" 등
  rtnCode?: string; // "020011", "000002" 등
  message?: string;
  rtnMessage?: string;
} | null;

export type LocalError = {
  code: string | number;
  message?: string;
  details?: string;
};

export type NotifyType = {
  url?: string;
  message?: string;
} | null;

export type SuccessType = {
  url?: string;
  code?: string | number;
  message?: string;
} | null;

export type ExpiredType = {
  time?: any;
  expiredDismissed?: boolean;
} | null;

export type LoadingType = {
  message?: string;
} | null;
