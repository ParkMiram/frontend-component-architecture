import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GridSortDirection } from "@mui/x-data-grid";

import { ModalConfig } from "../../../../types/interface/ModalInterface";
import { ModalPropsType } from "../../../../types/type/ModalType";
import DataTable from "../../../../organisms/DataTable.tsx";
import {
  addableUserGroupsListAtom,
  fetchAddableUserGroupsList,
  fetchAddUserGroups,
} from "../../../../recoil/atoms/user";
import { Refreshable } from "../../../../types/type/refresh";
import { FetchUserDetailParams } from "../../../../types/type/PageType";
import { useFetchList } from "../../../../hooks/fetchListData";
import {
  useErrorModal,
  useNotifyModal,
  useSuccessModal,
} from "../../../../hooks/useCustomModal";

const AddableUserGroupsForm: React.FC<ModalPropsType> = ({
  onSuccess,
  userId,
  handleModal,
}) => {
  // recoil
  const setAddableUserGroupsList = useSetRecoilState(addableUserGroupsListAtom);
  const { loading, error } = useRecoilValue(addableUserGroupsListAtom);

  // var
  const { openError } = useErrorModal();
  const { openNotify } = useNotifyModal();
  const { openSuccess } = useSuccessModal();

  // state
  const [headerInfos, setHeaderInfos] = useState([]);
  const [list, setList] = useState([]);
  const [totCnt, setTotCnt] = useState(0);
  const defaultSortOption = { column: 0, direction: "ASC" }; // 상태
  const itemsPerPage = 10;
  const [sortOption, setSortOption] = useState(defaultSortOption);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<any[]>([]); // row 데이터
  // init
  const [params, setParams] = useState<Refreshable<FetchUserDetailParams>>({
    userId: userId,
    list: {
      isHeaderInfo: true,
      rowCnt: itemsPerPage,
      startNum: 0,
      sortIdx: defaultSortOption?.column,
      order: defaultSortOption?.direction,
    },
  });

  //fn
  // fetch
  useFetchList(params, {
    setState: setAddableUserGroupsList,
    fetchList: fetchAddableUserGroupsList,
    setHeaderInfos,
    setList,
    setTotCnt,
  });

  // format - header
  const formatHeaderInfos = (headerInfos: any[]) => {
    return headerInfos?.map((item) => ({
      ...item,
      minWidth:
        item.keyName === "regDate" ||
        item.keyName === "name" ||
        item.keyName === "description"
          ? 160
          : undefined,
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

    if (rowSelection.length > 0) {
      const arr = rowSelection.map((item) => {
        return { groupSeq: item.seq };
      });

      try {
        const result = await fetchAddUserGroups({
          totCnt: rowSelection.length,
          userId: userId,
          items: arr,
        });

        if (result.header?.rtnCode === "000000") {
          openSuccess({
            message: "추가되었습니다.",
            url: "사용자 그룹 추가",
          });
          onSuccess?.();
        } else {
          openError({
            code: result.error.code,
            message: result.error.message,
            url: "사용자 그룹 추가",
          });
        }
      } catch (err: any) {
        openError({
          message: err,
        });
      }
    } else {
      openNotify({
        message: "그룹을 선택해 주세요.",
        url: "사요자 그룹 추가",
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
        rowId={"groupId"}
        setRowSelection={setRowSelection}
        totCnt={totCnt}
        onPageChange={handlePageChange}
      />
    </form>
  );
};

export const AddableUserGroups = (
  onSuccess: () => void,
  userId: string,
  setIsAddUserGroupsOpen: React.Dispatch<React.SetStateAction<boolean>>,
): ModalConfig => ({
  title: "사용자 그룹 추가",
  content: (
    <AddableUserGroupsForm
      handleModal={setIsAddUserGroupsOpen}
      userId={userId}
      onSuccess={onSuccess}
    />
  ),
  closeButton: "닫기",
  confirmButton: "추가",
  formId: "add-users-group-form",
});
