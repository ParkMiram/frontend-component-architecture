import React, { ReactNode } from "react";

import { SelectType } from "@/types/type/LayoutForm.ts";

interface FormInterface {
  label: string;
  required: boolean;
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string;
}

export interface InputFormInterface extends FormInterface {
  name?: string;
  value: any;
  setValue?: (val: any) => void;
  min?: number;
  max?: number;
  type?: string;
  buttonStyle?:
    | "default"
    | "danger"
    | "primary"
    | "secondary"
    | "success"
    | "warning";
  buttonText?: string;
  handleButton?: ({
    name,
    value,
  }: {
    name?: string;
    value: string;
  }) => Promise<void>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  isInvalid?: boolean | null;
  tooltip?: ReactNode;
  useTextarea?: boolean;
  useNumber?: boolean;
  useDatePicker?: boolean;
  message?: string;
}

export interface SelectFormInterface extends FormInterface {
  select: SelectType;
  setSelect: (next: SelectType) => void;
  options: SelectType[];
  isInvalid?: boolean | null;
}

export interface FileUploadFormInterface extends FormInterface {
  name?: string;
  value: string[];
  setValue: React.Dispatch<React.SetStateAction<string[]>>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  error?: string;
  onChange?: (files: File[] | File | null) => void;
  multiple?: boolean;
}

export interface FieldInputFormInterface {
  name?: string;
  value: string;
  setValue: (val: string) => void;
  placeholder?: string;
  type?: string;
}
