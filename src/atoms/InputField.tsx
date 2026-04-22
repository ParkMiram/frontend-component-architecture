import { Input } from "@heroui/react";

import { FieldInputFormInterface } from "../types/interface/FormInterface.ts";

export const InputField = ({
  name,
  value,
  setValue,
  placeholder,
  type,
}: FieldInputFormInterface) => {
  return (
    <div className="form-component-container">
      <div className="form-content">
        <Input
          className="form-input"
          name={name}
          placeholder={placeholder}
          type={type ?? "text"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
};
