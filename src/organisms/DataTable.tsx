import "../styles/table.scss";

import type { Selection, Key } from "@react-types/shared";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  Pagination,
  Spinner,
} from "@heroui/react";
import React, {
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretRight } from "@fortawesome/free-solid-svg-icons";

import { TableProps } from "@/types/interface/PageInterface.ts";
import { ChipCellProps, ResizeState } from "@/types/type/TableType.ts";
import { useIsTruncated } from "@/hooks/useIsTruncated.ts";
import { useMeasureWidth } from "@/hooks/useMeasureWidth.ts";

// chip component
const ChipCell = forwardRef<HTMLDivElement, ChipCellProps>(function ChipCell(
  { value, onWidthChange },
  _,
) {
  const { ref, width } = useMeasureWidth<HTMLDivElement>();
  const sentRef = useRef(false);

  useEffect(() => {
    if (!sentRef.current && width) {
      onWidthChange?.(width);
      sentRef.current = true;
    }
  }, [width]);

  return (
    <div ref={ref} className="chip-cell-wrapper">
      {isValidElement(value)
        ? cloneElement(value as React.ReactElement<any>, {
            className: "chip-ellipsis",
          })
        : value}
    </div>
  );
});

const DataTable = ({
  headerInfos,
  list,
  rowId,
  itemsPerPage,
  isLoading,
  handleSortChange,
  sortDescriptor,
  setRowSelection,
  isMulti,
  onClickDetail,
  isSorting = true,
  page,
  onPageChange,
}: TableProps) => {
  // state
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<Key>());

  // cell component
  const CellWithTooltip = ({ value }: { value: any }) => {
    let realValue;

    if (value && typeof value === "object" && "value" in value) {
      realValue = value.value;
    } else {
      realValue = value ?? "";
    }

    const { ref, isTruncated } = useIsTruncated<HTMLSpanElement>();

    return (
      <Tooltip
        showArrow
        color="foreground"
        content={realValue}
        isDisabled={!isTruncated}
        placement="bottom-start"
      >
        <span ref={ref} className="cell-text">
          {realValue}
        </span>
      </Tooltip>
    );
  };

  // ref
  const resizingRef = useRef<ResizeState | null>(null);

  // resize
  const startResize = (
    e: React.MouseEvent<HTMLButtonElement>,
    keyName: string | number,
  ) => {
    resizingRef.current = {
      keyName,
      startX: e.clientX,
      startWidth: columnWidths[keyName],
    };

    document.addEventListener("mousemove", handleResize);
    document.addEventListener("mouseup", stopResize);
  };

  const handleResize = (e: { clientX: number }) => {
    if (!resizingRef.current) return;

    const { keyName, startX, startWidth } = resizingRef.current;

    const minW = Math.max(chipMinWidth[keyName] ?? 0, 50);
    const newWidth = Math.max(minW, startWidth + (e.clientX - startX));

    setColumnWidths((prev: any) => ({
      ...prev,
      [keyName]: newWidth,
    }));
  };

  const stopResize = () => {
    resizingRef.current = null;
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
  };

  // header
  const visibleHeaders = [
    {
      _key: "__head",
      keyName: "__head",
      name: "상세",
      isFixed: true,
      minWidth: 50,
      maxWidth: 50,
    },
    ...(headerInfos ?? [])
      .filter((h) => h.isDisplay || h.display)
      .map((h) => ({
        ...h,
        _key: h.keyName,
      })),
    {
      _key: "__tail",
      keyName: "__tail",
      name: "상세",
      isFixed: true,
      minWidth: 50,
      maxWidth: 50,
    },
  ];

  // pagination
  const safePage = page && page > 0 ? page : 1;
  const items = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return list.slice(start, end);
  }, [safePage, list, itemsPerPage]);

  // width 상태
  const initialWidths = Object.fromEntries(
    (visibleHeaders ?? [])
      .filter((h) => h.isDisplay || h.display)
      .map((h) => [h.keyName, h.minWidth ?? 50]),
  );

  // width state
  const [columnWidths, setColumnWidths] = useState(initialWidths);
  const [chipMinWidth, setChipMinWidth] = useState<
    Record<string, number | undefined>
  >({});

  // row checkbox
  const handleSelectionChange = (keys: Selection) => {
    // "전체 선택" 막기
    if (keys === "all") return;

    // 항상 1개만 남기기
    const last = Array.from(keys).pop();

    setSelectedKeys(
      last ? (new Set<Key>([last]) as Selection) : new Set<Key>(),
    );
  };

  const selectedKeysRef = useRef<Selection>(new Set<Key>());

  useEffect(() => {
    selectedKeysRef.current = selectedKeys;
  }, [selectedKeys]);

  // row click
  const handleRowClick = (rowData: any) => {
    const current = selectedKeysRef.current;

    if ((current as Set<Key>).size > 0) {
      setRowSelection(rowData);
    } else {
      setRowSelection(null);
    }
  };

  // chip column
  const isChipColumn = (keyName: string) =>
    headerInfos?.some((h) => h.keyName === keyName && h.isChip);

  // detail
  const handleDetailView = (id: string) => {
    if (!id) return;
    onClickDetail?.(id);
  };

  // pagination
  const totalPages = Math.max(1, Math.ceil(list.length / itemsPerPage));

  return (
    <div className="table-container">
      <Table
        aria-label="DataTable"
        color={"primary"}
        {...(isMulti && {
          selectedKeys,
          onSelectionChange: handleSelectionChange,
        })}
        selectionMode={isMulti ? "multiple" : undefined}
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor) => {
          const keyName = String(descriptor.column);

          // head / tail 컬럼 방어
          if (keyName === "__head" || keyName === "__tail") return;

          const direction =
            descriptor.direction === "ascending" ? "asc" : "desc";

          handleSortChange?.(keyName, direction);
        }}
      >
        <TableHeader columns={visibleHeaders}>
          {(column) => {
            const isDetailColumn =
              column._key === "__head" || column._key === "__tail";

            return (
              <TableColumn
                key={column._key}
                allowsSorting={isSorting && !isDetailColumn}
                aria-label={column.name}
                style={{
                  width: Math.max(
                    columnWidths[column._key] ?? column.minWidth,
                    chipMinWidth[column._key] ?? column.minWidth ?? 50,
                  ),
                  minWidth: Math.max(chipMinWidth[column._key] ?? 0, 50),
                  maxWidth: column.maxWidth,
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                <span className="table-header">{column.name}</span>
                {column._key === "__head" || column._key === "__tail" ? (
                  <span className="resize-none" />
                ) : (
                  <button
                    aria-label="Resize column"
                    className="resize-handle"
                    type="button"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      startResize(e, column._key);
                    }}
                  />
                )}
              </TableColumn>
            );
          }}
        </TableHeader>
        <TableBody
          emptyContent={"No rows to display."}
          isLoading={isLoading}
          items={items ?? []}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item[rowId]} onClick={() => handleRowClick(item)}>
              {(columnKey) => {
                const isHead = columnKey === "__head";
                const isTail = columnKey === "__tail";
                const cell = item[columnKey];

                if (isHead || isTail) {
                  return (
                    <TableCell>
                      <Button
                        className="cell-detail"
                        variant="light"
                        onPress={() => handleDetailView(item[rowId])}
                      >
                        <FontAwesomeIcon icon={faSquareCaretRight} />
                      </Button>
                    </TableCell>
                  );
                }
                if (isChipColumn(String(columnKey))) {
                  return (
                    <TableCell
                      style={{
                        minWidth: 0,
                        flexShrink: 1,
                        flexGrow: 0,
                      }}
                    >
                      <ChipCell
                        value={cell?.value}
                        onWidthChange={(w: number) =>
                          setChipMinWidth((prev) => {
                            const next = Math.max(prev[columnKey] ?? 0, w);

                            setColumnWidths((cw: { [x: string]: any }) => ({
                              ...cw,
                              [columnKey]: Math.max(cw[columnKey] ?? 0, next),
                            }));

                            return {
                              ...prev,
                              [columnKey]: next,
                            };
                          })
                        }
                      />
                    </TableCell>
                  );
                }

                return (
                  <TableCell
                    style={{
                      minWidth: 0,
                      flexShrink: 1,
                      flexGrow: 0,
                    }}
                  >
                    <CellWithTooltip value={cell} />
                  </TableCell>
                );
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={safePage}
          total={totalPages}
          onChange={(p) => onPageChange?.(p)}
        />
      </div>
    </div>
  );
};

export default DataTable;
