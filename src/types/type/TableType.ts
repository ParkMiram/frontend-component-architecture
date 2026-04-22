export type ResizeState = {
  keyName: string | number;
  startX: number;
  startWidth: number;
};

export type ChipCellProps = {
  value: string;
  onWidthChange?: (width: number) => void;
};

export type HeaderInfo = {
  keyName: string;
  name: string;
  isDisplay: boolean;
};
