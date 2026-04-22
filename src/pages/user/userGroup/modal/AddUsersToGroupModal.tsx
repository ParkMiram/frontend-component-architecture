import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GridSortDirection } from "@mui/x-data-grid";

import DataTable from "../../../../organisms/DataTable.tsx";

import {
  useErrorModal,
  useNotifyModal,
  useSuccessModal,
} from "@/hooks/useCustomModal.ts";
import { ModalConfig } from "@/types/interface/ModalInterface.ts";
import { ModalPropsType } from "@/types/type/ModalType.ts";
import {
  fetchUserGroupAdd,
  fetchUserGroupUserAddList,
  userGroupUserAddListAtom,
} from "@/recoil/atoms/userGroup.ts";
import { Refreshable } from "@/types/type/refresh.ts";
import { FetchUserDetailParams } from "@/types/type/PageType.ts";
import { useFetchList } from "@/hooks/fetchListData.ts";

const AddUsersToGroupForm: React.FC<ModalPropsType> = ({
  onSuccess,
  row,
  handleModal,
}) => {
  // recoil
  const setUserGroupUserAddList = useSetRecoilState(userGroupUserAddListAtom);
  const { loading, error } = useRecoilValue(userGroupUserAddListAtom);

  // var
  const { openNotify } = useNotifyModal();
  const { openError } = useErrorModal();
  const { openSuccess } = useSuccessModal();

  // state
  const [headerInfos, setHeaderInfos] = useState([]);
  const [list, setList] = useState([]);
  const [totCnt, setTotCnt] = useState(0);
  const defaultSortOption = { column: 4, direction: "ASC" }; // 상태
  const itemsPerPage = 10;
  const [sortOption, setSortOption] = useState(defaultSortOption);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<any[]>([]); // row 데이터
  // init
  const [params, setParams] = useState<Refreshable<FetchUserDetailParams>>({
    groupSeq: row.groupSeq,
    list: {
      isHeaderInfo: true,
      rowCnt: itemsPerPage,
      startNum: 0,
      sortIdx: defaultSortOption?.column,
      order: defaultSortOption?.direction,
    },
  });

  // fn
  // fetch
  useFetchList(params, {
    setState: setUserGroupUserAddList,
    fetchList: fetchUserGroupUserAddList,
    setHeaderInfos,
    setList,
    setTotCnt,
  });

  // format - header
  const formatHeaderInfos = (headerInfos: any[]) => {
    return headerInfos?.map((item) => ({
      ...item,
      minWidth: item.keyName === "regDate" ? 160 : undefined,
    }));
  };

  // pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setParams((p) => ({
      ...p,
      startNum: (page - 1) * itemsPerPage,
      rowCnt: itemsPerPage,
    }));
  };

  // sort
  const handleSortChange = (
    key: string | number | undefined,
    direction: GridSortDirection,
  ) => {
    if (!direction || typeof key !== "number") return; // 초기화된 경우 무시
    setSortOption({ column: key, direction: direction.toUpperCase() });
    setParams((p) => ({ ...p, sortIdx: key, order: direction.toUpperCase() }));
  };

  // submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const arr = rowSelection.map((item) => {
      return { userSeq: item.userSeq };
    });

    if (rowSelection.length > 0) {
      try {
        const result = await fetchUserGroupAdd({
          totCnt: rowSelection.length,
          groupSeq: row.groupSeq,
          items: arr,
        });

        if (result.header.rtnCode === "000000") {
          openSuccess({
            message: "추가되었습니다.",
            url: "그룹에 사용자 추가",
          });
          onSuccess?.();
        } else {
          openError({
            code: result.header.rtnCode,
            message: result.header.rtnMessage,
            url: "그룹에 사용자 추가",
          });
        }
      } catch (err: any) {
        openError({
          message: err,
        });
      }
    } else {
      openNotify({
        message: "사용자를 선택해 주세요.",
        url: "그룹에 사용자 추가",
      });

      return;
    }
  };

  useEffect(() => {
    if (error) handleModal(false);
  }, [error, handleModal]);

  return (
    <form
      id="add-users-group-form"
      onKeyDown={(e) => {
        if ((e as any).isComposing) return;
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onSubmit={handleSubmit}
    >
      <DataTable
        checkbox={true}
        defaultSortOption={sortOption}
        handleSortChange={handleSortChange}
        headerInfos={formatHeaderInfos(headerInfos)}
        isLoading={loading}
        isMulti={true}
        itemsPerPage={itemsPerPage}
        list={list}
        page={currentPage}
        rowId={"userId"}
        setRowSelection={setRowSelection}
        totCnt={totCnt}
        onPageChange={handlePageChange}
      />
    </form>
  );
};

export const AddUsersToGroupModal = (
  onSuccess: () => void,
  row: any,
  setIsAddUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
): ModalConfig => ({
  title: "그룹에 사용자 추가",
  content: (
    <AddUsersToGroupForm
      handleModal={setIsAddUserModalOpen}
      row={row}
      onSuccess={onSuccess}
    />
  ),
  closeButton: "닫기",
  confirmButton: "추가",
  formId: "add-users-group-form",
});
