import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

import { SelectProps } from "../types/interface/PageInterface";

const StyledSelect = ({
  value,
  setSelectValue,
  selectItems,
  className,
  placeholder,
  disabled,
  confirmChange,
}: SelectProps) => {
  const safeValue = selectItems.some((item) => item.value === value?.value)
    ? value.value
    : "";

  const findLabel = (val: string) =>
    selectItems.find((i) => i.value === val)?.label ?? "";

  const placeholderLabel = findLabel("") || placeholder || "선택";

  const handleChange = async (e: SelectChangeEvent) => {
    const selected = selectItems.find((item) => item.value === e.target.value);

    if (!selected) return;

    if (selected.value === (value?.value ?? "")) return; // 같은 값 무시

    // 부모에게 확인 요청
    const ok = confirmChange
      ? await confirmChange(selected, value ?? null)
      : true;

    if (ok) {
      setSelectValue(selected);
    }
    // 취소면 아무 것도 하지 않음(Select는 여전히 확정 값 표시)
  };

  return (
    <>
      <Select
        disableUnderline
        displayEmpty
        className={className ? `${className} select` : "select"}
        disabled={disabled}
        renderValue={(selected) =>
          selected === "" ? placeholderLabel : findLabel(selected)
        }
        sx={{
          minWidth: "80px",
          borderRadius: "8px",
          "& .MuiSelect-select": {
            padding: "3px 9px",
            "&::before": {
              borderBottom: "none",
            },
          },
        }}
        value={safeValue}
        variant={"filled"}
        onChange={handleChange}
      >
        {selectItems.map((item) => (
          <MenuItem
            key={item.value}
            sx={{
              fontSize: "14px",
              padding: "4px 8px",
            }}
            value={item.value}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </>
  );
};

export default StyledSelect;
