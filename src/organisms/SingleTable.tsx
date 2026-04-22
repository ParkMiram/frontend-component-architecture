import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { SingleTableProps } from "../types/interface/PageInterface";
import { TableHeaderInfo } from "../types/type/PageType";
import NoRows from "../atoms/NoRows";
import { GridSkeleton } from "../atoms/Skeleton";

const SingleTable = ({
  headerInfos,
  list,
  rowId,
  checkbox,
  isLoading,
  handleCellFeatures,
}: SingleTableProps) => {
  // headerInfos
  const columns = React.useMemo<GridColDef[]>(() => {
    const cols = (headerInfos as TableHeaderInfo[]).map((col) => ({
      // idx: col.idx,
      field: col.keyName,
      headerName: col.name,
      flex: 1,
      minWidth: col.minWidth || 120,
      renderCell: handleCellFeatures
        ? handleCellFeatures(col.keyName)
        : undefined,
      isDisplay: !!(col.isDisplay || col.display),
    })) as (GridColDef & { isDisplay?: boolean })[];

    return cols.filter((c) => c.isDisplay);
  }, [headerInfos, handleCellFeatures]);

  const minWidth = React.useMemo(
    () => `${columns.length * 100}px`,
    [columns.length],
  );

  // list 비었을 경우
  const showNoRows = !isLoading && list.length === 0;

  return (
    <div className="table-container single">
      <div style={{ minWidth, height: "112px" }}>
        <DataGrid
          columns={columns}
          getRowId={(row) => row[rowId as string]}
          isRowSelectable={() => !!checkbox} // 행 클릭 여부
          rowHeight={46}
          rows={list ?? []}
          slots={{
            noRowsOverlay: showNoRows ? NoRows : () => null,
            loadingOverlay: GridSkeleton
        }}
          sx={{
            // 전체
            border: "1px solid var(--gray-300)",
            padding: "var(--spacing-sm)",
            borderRadius: "var(--spacing-sm)",
            outline: "none !important",
            // header
            "& .MuiDataGrid-columnHeaders": {
              borderRadius: "var(--spacing-sm)",
              overflow: "hidden",
              marginBottom: "var(--spacing-sm)",
              "& .MuiDataGrid-filler": {
                borderBottom: "none",
                backgroundColor: "var(--gray-150)",
              },
            },
            // header borderRadius
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "var(--gray-150)",
              borderRadius: 0,
              border: "none !important",
            },
            "& .MuiDataGrid-columnHeader:first-of-type": {
              borderTopLeftRadius: "var(--spacing-sm)",
              borderBottomLeftRadius: "var(--spacing-sm)"
            },
            "& .MuiDataGrid-columnHeader:last-of-type": {
              borderTopRightRadius: "var(--spacing-sm)",
              borderBottomRightRadius: "var(--spacing-sm)"
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              color: "var(--gray-700)",
              fontWeight: "bold",
            },
            "& .MuiDataGrid-columnSeparator": {
              color: "var(--gray-500)",
              display: "none",
            },
            // header checkbox
            "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
              color: "var(--gray-500)",
            },
            // column
            "& .MuiDataGrid-row": {
              borderRadius: "var(--spacing-sm)",
              marginBottom: "var(--spacing-xs)",
              "&:last-child": {
                marginBottom: 0
              }
            },
            "& .MuiDataGrid-cell": {
              border: "none !important",
            },
            "& .MuiDataGrid-filler div": {
              border: "none",
            },
            "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
              outline: 'none !important',
            },
            "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
              outline: 'none !important',
            },
            // column checkbox
            "& .MuiCheckbox-root": {
              color: "var(--gray-400)",
              "&.Mui-checked": {
                color: "#1976d2",
              },
            },
            "& .MuiDataGrid-footerContainer": {
              border: "none",
              "& .MuiTablePagination-toolbar": {
              },
              "& .MuiDataGrid-selectedRowCount": {
                color: "var(--gray-500)"
              },
              "& .MuiTablePagination-displayedRows": {
                color: "var(--gray-700)"
              }
            }
          }}
          hideFooter
          // style
          columnHeaderHeight={40}
          loading={isLoading} // 로딩 여부
          // slotProps={{
          //   loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' },
          // }}
          checkboxSelection={!!checkbox} // 체크 박스 여부
        />
      </div>
    </div>
  );
};

export default SingleTable;
