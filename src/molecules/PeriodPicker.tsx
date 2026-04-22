import { DatePicker } from "@heroui/react";

import { PeriodPickerType } from "@/types/type/PeriodType.ts";

export const PeriodPicker = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setIsPeriodValid,
}: PeriodPickerType) => {
  const selectedDate = (name: string, value: any) => {
    if (name === "start") setStartDate(value);
    if (name === "end") setEndDate(value);

    setIsPeriodValid(null);
  };

  return (
    <div className="date-picker-container">
      <div className="date-picker gap-2">
        <DatePicker
          isRequired
          showMonthAndYearPickers
          label="시작 일자"
          minValue={startDate}
          selectorButtonPlacement="end"
          value={startDate ?? undefined}
          onChange={(v) => {
            selectedDate("start", v);
          }}
        />
        <DatePicker
          isRequired
          showMonthAndYearPickers
          label="종료 일자"
          minValue={startDate}
          selectorButtonPlacement="end"
          value={endDate ?? undefined}
          onChange={(v) => {
            selectedDate("end", v);
          }}
        />
      </div>
    </div>
  );
};
