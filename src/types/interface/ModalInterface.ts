import { ReactNode } from "react";

export interface ModalConfig {
  title: string;
  content: ReactNode;
  footer?: ReactNode;
  closeButton?: string;
  confirmButton?: string;
  formId?: string;
  // loading?: boolean;
  // disabled?: boolean | false;
}

export interface ExpiredModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}
