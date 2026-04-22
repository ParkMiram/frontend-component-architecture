import React, { CSSProperties } from "react";
import { Key } from "@react-types/shared";

// PageContent
export interface PageContentProps {
  headerInfos: any[] | undefined;
  list: any[];
  rowId: string;
  handleSort?: (key: string) => void;
  sortOption?: string;
  filter?: boolean;
  currentPage?: number;
  totCnt?: number | undefined;
  itemsPerPage?: number;
  isLoading?: boolean;
  handleSortChange: (orderBy: string, orderDirection: "asc" | "desc") => void;
  sortDescriptor?: {
    column: Key;
    direction: "ascending" | "descending";
  };
  handleCellFeatures?: any;
  setRowSelection?: any | undefined;
  children: React.ReactNode;
  handleFilterList?: () => React.JSX.Element;
  isMulti?: boolean;
  onClickDetail?: (id: string) => void;
  isSorting?: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

// SinglePageContent
export interface SinglePageContentProps {
  headerInfos: any[] | undefined;
  list: any[];
  rowId?: string;
  checkbox?: boolean;
  isLoading?: boolean;
  itemsPerPage?: number;
  handleCellFeatures?: any;
  children: React.ReactNode;
}

// DetailPageContent
export interface DetailPageContentProps {
  link: string;
  title: string;
  id?: string;
  infoData: any;
  keys: string[] | null;
}

// Tab
export interface TabContainerProps {
  tabs: any;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  style?: CSSProperties;
  children: React.ReactNode;
}

// Search
export interface SearchProps {
  handleFilterChange: (value: string) => void;
  label?: string;
  onPageChange: (page: number) => void;
  children?: React.ReactNode;
}

// Table
export interface TableProps {
  headerInfos: any[] | undefined;
  list: any[];
  rowId: string;
  checkbox?: boolean;
  handleSort?: (key: string) => void;
  sortOption?: string;
  filter?: boolean;
  currentPage?: number;
  totCnt?: number | undefined;
  itemsPerPage: number;
  isLoading?: boolean;
  defaultSortOption?: { column: Key; direction: string };
  handleSortChange: (orderBy: string, orderDirection: "asc" | "desc") => void;
  sortDescriptor?: {
    column: Key;
    direction: "ascending" | "descending";
  };
  handleCellFeatures?: any;
  setRowSelection?: any;
  isMulti?: boolean;
  onClickDetail?: (id: string) => void;
  isSorting?: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

// Table Row
export interface RowSelection {
  id: string;
  columns: any[];
  row: Record<string, any>;
}

// Single Table
export interface SingleTableProps {
  headerInfos: any[] | undefined;
  list: any[];
  rowId?: string;
  checkbox?: boolean;
  isLoading?: boolean;
  itemsPerPage?: number;
  handleCellFeatures?: any;
}

// Tooltip
export interface TooltipProps {
  value: string;
  children: React.ReactElement;
}

// Select
type Item = { label: string; value: string };
export interface SelectProps {
  value: Item;
  setSelectValue: (value: Item) => void;
  selectItems: Item[];
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  confirmChange?: (
    selected: Item,
    current: Item | null,
  ) => boolean | Promise<boolean>;
}
