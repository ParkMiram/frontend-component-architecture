// Table Header
import { GridRenderCellParams } from "@mui/x-data-grid";
import React from "react";
import { Key } from "@react-types/shared";

export type TableHeaderInfo = {
  idx: number;
  keyName: string;
  name: string;
  isFilter?: boolean;
  filter?: boolean | undefined;
  isDisplay?: boolean;
  display?: boolean | undefined;
  isSort?: boolean;
  sort?: boolean | undefined;
  minWidth?: number | undefined;
  renderCell?: (params: GridRenderCellParams) => React.ReactNode;
};

export type FilterArrProps = {
  filterOp: string;
  keyName: string;
  keyValue: string;
};

export type FetchListParams = {
  isHeaderInfo: boolean;
  rowCnt: number;
  startNum: number;
  sortKeyName: Key;
  order: string;
  filter?: string | null;
  filterArrAndOr?: string | null;
  filterArr?: FilterArrProps[] | null;
  configType?: string | null;
};

export type FetchUserListParams = {
  isHeaderInfo: boolean;
  rowCnt: number;
  startNum: number;
  sortIdx: number;
  order: string;
  filter: string | null;
};

export type FetchUserInfoParams = {
  isHeaderInfo: boolean;
  userId: string;
};

export type FetchUserDetailParams = {
  userId?: string;
  groupSeq?: number;
  list: {
    isHeaderInfo: boolean;
    rowCnt?: number;
    startNum: number;
    sortIdx: number;
    order: string;
  };
};
