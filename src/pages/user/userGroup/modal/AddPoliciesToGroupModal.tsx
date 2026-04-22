import React, { useEffect, useMemo, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { ModalConfig } from "../../../../types/interface/ModalInterface";
import { ModalPropsType } from "../../../../types/type/ModalType";
import {
  fetchUserGroupPolicyAdd,
  fetchUserGroupPolicyAddList,
  userGroupPolicyAddListAtom,
} from "../../../../recoil/atoms/userGroup";
import { FetchUserDetailParams } from "../../../../types/type/PageType";
import { useFetchList } from "../../../../hooks/fetchListData";
import DataTable from "../../../../organisms/DataTable.tsx";
import {
  useErrorModal,
  useNotifyModal,
  useSuccessModal,
} from "../../../../hooks/useCustomModal";

const AddPoliciesToGroupForm: React.FC<ModalPropsType> = ({
  onSuccess,
  row,
  handleModal,
}) => {
  // recoil
  const setUserGroupPolicyAddList = useSetRecoilState(
    userGroupPolicyAddListAtom,
  );
  const { loading, error } = useRecoilValue(userGroupPolicyAddListAtom);

  // var
  const { openError } = useErrorModal();
  const { openSuccess } = useSuccessModal();
  const { openNotify } = useNotifyModal();

  // state
  const [headerInfos, setHeaderInfos] = useState([]);
  const [list, setList] = useState([]);
  const [totCnt, setTotCnt] = useState(0);
  const defaultSortOption = { column: 0, direction: "DESC" }; // 정책 ID
  const itemsPerPage = list?.length;
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<any[]>([]); // row 데이터

  console.log(setCurrentPage);

  // init
  const params = useMemo<FetchUserDetailParams>(
    () => ({
      groupSeq: row.groupSeq,
      list: {
        isHeaderInfo: true,
        rowCnt: itemsPerPage,
        startNum: 0,
        sortIdx: defaultSortOption?.column,
        order: defaultSortOption?.direction,
      },
    }),
    [
      row.groupSeq,
      itemsPerPage,
      defaultSortOption?.column,
      defaultSortOption?.direction,
    ],
  );

  // fn
  // fetch
  useFetchList(params, {
    setState: setUserGroupPolicyAddList,
    fetchList: fetchUserGroupPolicyAddList,
    setHeaderInfos,
    setList,
    setTotCnt,
  });

  // submit
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const arr = rowSelection.map((item) => {
      return { id: item.id };
    });

    try {
      if (rowSelection.length > 0) {
        const result = await fetchUserGroupPolicyAdd({
          groupId: row.groupId,
          groupSeq: row.groupSeq,
          items: arr,
          totalCnt: rowSelection.length,
        });

        if (result.header.rtnCode === "000000") {
          openSuccess({
            message: "추가되었습니다.",
            url: "그룹에 권한 추가",
          });
          onSuccess?.();
        } else {
          openError({
            code: result.header.rtnCode,
            message: result.header.rtnMessage,
            url: "그룹에 권한 추가",
          });
        }
      } else {
        openNotify({
          message: "권한을 선택해 주세요.",
          url: "그룹에 권한 추가",
        });

        return;
      }
    } catch (err: any) {
      openError({
        message: err,
        url: "그룹에 권한 추가",
      });
    }
  };

  useEffect(() => {
    if (error) handleModal(false);
  }, [error, handleModal]);

  return (
    <form
      id="add-policies-group-form"
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
        defaultSortOption={defaultSortOption}
        handleSortChange={() => {}}
        headerInfos={headerInfos}
        isLoading={loading}
        isMulti={true}
        itemsPerPage={itemsPerPage}
        list={list}
        page={currentPage}
        rowId={"id"}
        setRowSelection={setRowSelection}
        totCnt={totCnt}
        onPageChange={() => {}}
      />
    </form>
  );
};

export const AddPoliciesToGroupModal = (
  onSuccess: () => void,
  row: any,
  setIsAddPolicyModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
): ModalConfig => ({
  title: "그룹에 권한 추가",
  content: (
    <AddPoliciesToGroupForm
      handleModal={setIsAddPolicyModalOpen}
      row={row}
      onSuccess={onSuccess}
    />
  ),
  closeButton: "닫기",
  confirmButton: "추가",
  formId: "add-policies-group-form",
});
