import { DateValue } from "@react-types/datepicker";

export type PeriodPickerType = {
  startDate: DateValue | null;
  setStartDate: (value: DateValue) => void;
  endDate: DateValue | null;
  setEndDate: (value: DateValue) => void;
  setIsPeriodValid: (value: boolean | null) => void;
  label?: string;
};
