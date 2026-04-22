import "../styles/page.scss";
import DataTable from "../organisms/DataTable.tsx";
import {
  PageContentProps,
  SinglePageContentProps,
} from "../types/interface/PageInterface";
import SingleTable from "../organisms/SingleTable";

export const PageContent = (props: PageContentProps) => {
  return (
    <div className="page-content">
      {props.handleFilterList?.()}
      <div className={`page-content-header`}>{props.children}</div>
      <DataTable
        currentPage={props.currentPage}
        handleCellFeatures={props.handleCellFeatures}
        handleSortChange={props.handleSortChange}
        headerInfos={props.headerInfos}
        isLoading={props.isLoading}
        isMulti={props.isMulti}
        isSorting={props.isSorting}
        itemsPerPage={10}
        list={props.list}
        page={props.page}
        rowId={props.rowId}
        setRowSelection={props?.setRowSelection}
        sortDescriptor={props.sortDescriptor}
        totCnt={props.totCnt}
        onClickDetail={props.onClickDetail}
        onPageChange={props.onPageChange}
      />
    </div>
  );
};

export const SinglePageContent = (props: SinglePageContentProps) => {
  return (
    <div className="page-content">
      {props.children}
      <SingleTable
        checkbox={props.checkbox}
        handleCellFeatures={props.handleCellFeatures}
        headerInfos={props.headerInfos}
        isLoading={props.isLoading}
        itemsPerPage={props.itemsPerPage}
        list={props.list}
        rowId={props.rowId}
      />
    </div>
  );
};
