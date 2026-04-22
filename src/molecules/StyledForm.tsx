// label + input + button
import {
  Tooltip,
  Input,
  Button,
  Select,
  SelectItem,
  NumberInput,
  DatePicker,
} from "@heroui/react";

import {
  FileUploadFormInterface,
  InputFormInterface,
  SelectFormInterface,
} from "../types/interface/FormInterface.ts";

import "../styles/form.scss";

import React, { FocusEventHandler, useEffect, useMemo, useState } from "react";
import { Key } from "@react-types/shared";
import { Textarea } from "@heroui/input";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faUpload,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

import { SelectorIcon } from "@/assets/icons/SelectorIcon.tsx";
import { EyeFilledIcon } from "@/assets/icons/EyeFilledIcon.tsx";
import { EyeSlashFilledIcon } from "@/assets/icons/EyeSlashFilledIcon.tsx";

export const LabeledInputWithButton = ({
  label,
  required,
  name,
  value,
  setValue,
  placeholder,
  buttonText,
  handleButton,
  disabled,
  min = 0,
  max,
  errorMessage,
  type,
  onBlur,
  isInvalid,
  buttonStyle,
  tooltip,
  useNumber,
}: InputFormInterface) => {
  const [open, setOpen] = useState(false);

  const currentContent = useMemo(() => tooltip ?? undefined, [tooltip]);

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    setOpen(false);
    onBlur?.(e);
  };

  return (
    <div className="form-component-container">
      <div className="form-content">
        <div className="form">
          <Tooltip
            showArrow
            content={currentContent}
            isOpen={open}
            placement="left"
            trigger="focus"
          >
            {useNumber ? (
              <NumberInput
                color={"default"}
                disabled={disabled}
                errorMessage={errorMessage ?? ""}
                isInvalid={isInvalid ?? undefined}
                isRequired={required}
                label={label}
                labelPlacement="outside"
                minValue={min}
                name={name}
                placeholder={placeholder}
                value={value}
                variant="flat"
                onFocus={() => currentContent && setOpen(true)}
                onValueChange={(value: number | undefined) =>
                  setValue?.(value ?? 0)
                }
              />
            ) : (
              <Input
                color={"default"}
                errorMessage={errorMessage ?? ""}
                isInvalid={isInvalid ?? undefined}
                isRequired={required}
                label={label}
                labelPlacement="outside-top"
                maxLength={max}
                name={name}
                placeholder={placeholder}
                type={type ?? "text"}
                value={value}
                variant="flat"
                onBlur={handleBlur}
                onFocus={() => currentContent && setOpen(true)}
                onValueChange={setValue}
              />
            )}
          </Tooltip>
          <Button
            className="ml-2"
            color={buttonStyle ?? "default"}
            isDisabled={disabled}
            variant="faded"
            onPress={() => handleButton?.({ name, value })}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

// label + input
export const LabeledInput = ({
  label,
  required,
  name,
  value,
  setValue,
  placeholder,
  min = 0,
  max,
  errorMessage,
  type,
  onBlur,
  disabled,
  isInvalid,
  tooltip,
  useTextarea = false,
  useNumber = false,
  useDatePicker = false,
}: InputFormInterface) => {
  // 비밀번호
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  // tooltip
  const [open, setOpen] = useState(false);

  const currentContent = useMemo(() => tooltip ?? undefined, [tooltip]);

  const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
    setOpen(false);
    onBlur?.(e);
  };

  return (
    <div className="form-component-container">
      <Tooltip
        showArrow
        classNames={{
          content: "text-[12px]",
        }}
        content={currentContent}
        isOpen={open}
        placement="left"
        trigger="focus"
      >
        {useTextarea ? (
          <Textarea
            disableAnimation
            disableAutosize
            classNames={{
              input: "resize-y min-h-[40px]",
            }}
            errorMessage={errorMessage ?? ""}
            isInvalid={isInvalid ?? undefined}
            isRequired={required}
            label={label}
            labelPlacement="outside"
            name={name}
            placeholder={placeholder}
            value={value}
            variant="flat"
            onBlur={handleBlur}
            onFocus={() => currentContent && setOpen(true)}
            onValueChange={setValue}
          />
        ) : useNumber ? (
          <NumberInput
            color={"default"}
            disabled={disabled}
            errorMessage={errorMessage ?? ""}
            isInvalid={isInvalid ?? undefined}
            isRequired={required}
            label={label}
            labelPlacement="outside"
            minValue={min}
            name={name}
            placeholder={placeholder}
            value={value}
            variant="flat"
            onFocus={() => currentContent && setOpen(true)}
            onValueChange={(value: number | undefined) =>
              setValue?.(value ?? 0)
            }
          />
        ) : useDatePicker ? (
          <DatePicker
            hideTimeZone
            showMonthAndYearPickers
            color={"default"}
            errorMessage={errorMessage ?? ""}
            isDisabled={disabled}
            isInvalid={isInvalid ?? undefined}
            isRequired={required}
            label={label}
            labelPlacement="outside"
            name={name}
            value={value}
            onChange={(e) => setValue?.(e)}
          />
        ) : (
          <Input
            color={"default"}
            endContent={
              type === "password" ? (
                <button
                  aria-label="toggle password visibility"
                  className="focus:outline-solid outline-transparent cursor-pointer"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
                </button>
              ) : (
                <></>
              )
            }
            errorMessage={errorMessage ?? ""}
            isDisabled={disabled}
            isInvalid={isInvalid ?? undefined}
            isRequired={required}
            label={label}
            labelPlacement="outside-top"
            maxLength={max}
            name={name}
            placeholder={placeholder}
            type={
              type === "password"
                ? isVisible
                  ? "text"
                  : "password"
                : (type ?? "text")
            }
            value={value}
            variant="flat"
            onBlur={handleBlur}
            onFocus={() => currentContent && setOpen(true)}
            onValueChange={setValue}
          />
        )}
      </Tooltip>
    </div>
  );
};

// label + select
export const LabeledSelect = ({
  label,
  required,
  select,
  setSelect,
  options,
  isInvalid,
}: SelectFormInterface) => {
  const selectedKeys: Iterable<Key> | undefined = select?.value
    ? new Set<Key>([select.value as Key])
    : undefined;

  const handleSelectionChange = (keys: Set<React.Key> | "all") => {
    if (keys === "all") return;

    const value = Array.from(keys as unknown as Set<string>)[0] ?? "";
    const found = options.find((o) => o.value === value);

    setSelect(found ?? { value: "", label: "" });
  };

  return (
    <div className="form-component-container">
      <div className="form-content">
        <Select
          classNames={{
            base: "cursor-pointer",
            trigger: "cursor-pointer",
            value: "cursor-pointer",
            innerWrapper: "cursor-pointer",
          }}
          isInvalid={isInvalid ?? undefined}
          isRequired={required}
          label={label}
          labelPlacement="outside"
          placeholder={required ? "Required selection" : "Selection"}
          selectedKeys={selectedKeys}
          selectorIcon={<SelectorIcon />}
          variant="flat"
          onSelectionChange={handleSelectionChange}
        >
          {options.map((option) => (
            <SelectItem key={option.value}>{option.label}</SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

// label + file upload
export const LabeledFileUpload = ({
  label,
  required,
  value,
  setValue,
  error,
  onChange,
  multiple,
}: FileUploadFormInterface) => {
  // state
  const [alerts, setAlerts] = useState<string[]>([]);

  // fn
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    const fileList = Array.from(files);
    const names = fileList.map((file) => file.name);

    // 중복 제거
    setValue((prev) => {
      const filteredNames = names.filter((name) => !prev.includes(name));

      if (multiple) {
        return [...prev, ...filteredNames]; // 항상 배열 반환
      }

      // multiple = false 일 때
      if (filteredNames.length > 0) {
        return [filteredNames[0]]; // 새로운 파일
      }

      return prev; // 중복이면 기존 값 유지 (undefined 반환 X)
    });

    if (onChange) {
      onChange(multiple ? fileList : fileList[0]);
    }

    e.target.value = "";
  };

  const handleRemoveUploadedFile = (index: number) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
    setValue((prev) => prev.filter((_, i) => i !== index));
  };

  // value가 바뀌면 Alert도 업데이트
  useEffect(() => {
    setAlerts(value);
  }, [value]);

  return (
    <>
      <div className="flex flex-col w-full">
        <label
          className={`font-medium text-sm pb-2 ${error && "text-danger-500"}`}
        >
          {label}
          {required && (
            <span
              style={{
                color: "hsl(var(--heroui-danger) / 1)",
                marginLeft: "2px",
              }}
            >
              *
            </span>
          )}
        </label>
        {(multiple || (!multiple && alerts.length === 0)) && (
          <label
            className={clsx(
              "rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition",
              error
                ? "bg-danger-50 hover:bg-danger-100 mb-1"
                : "bg-default-100 hover:bg-default-200 mb-2",
            )}
          >
            <input className="hidden" type="file" onChange={handleFile} />

            <FontAwesomeIcon
              className={error ? "text-danger-500" : "text-default-500"}
              icon={faUpload}
            />
          </label>
        )}

        {error && <p className="text-danger text-tiny mb-1">{error}</p>}
      </div>
      <div key="uploadedFile" className="flex flex-col">
        {alerts.map((name, idx) => (
          <div key={name} className="uploadedFile">
            <FontAwesomeIcon icon={faPaperclip} />
            <p className="uploadedFileName">{name}</p>
            <Button
              className="removeUploadedFile"
              onPress={() => handleRemoveUploadedFile(idx)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};
