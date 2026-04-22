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
  fetchUserPolicyAdd,
  fetchUserPolicyAddList,
  userPolicyAddListAtom,
} from "@/recoil/atoms/user.ts";
import { FetchUserDetailParams } from "@/types/type/PageType.ts";
import { useFetchList } from "@/hooks/fetchListData.ts";

const UserPolicyAddForm: React.FC<ModalPropsType> = ({
  onSuccess,
  userId,
  handleModal,
}) => {
  // recoil
  const setPolicyAddList = useSetRecoilState(userPolicyAddListAtom);
  const { loading, error } = useRecoilValue(userPolicyAddListAtom);

  // var
  const { openError } = useErrorModal();
  const { openNotify } = useNotifyModal();
  const { openSuccess } = useSuccessModal();

  // state
  const [headerInfos, setHeaderInfos] = useState([]);
  const [list, setList] = useState<any[]>([]);
  const [totCnt, setTotCnt] = useState(0);
  const defaultSortOption = { column: 0, direction: "DESC" }; // 정책 ID
  const itemsPerPage = list?.length;
  const [sortOption, setSortOption] = useState(defaultSortOption);
  // const [currentPage, setCurrentPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<any[]>([]); // row 데이터
  // init
  const [params, setParams] = useState<FetchUserDetailParams>({
    userId: userId as string,
    list: {
      isHeaderInfo: true,
      rowCnt: 0,
      startNum: 0,
      sortIdx: defaultSortOption.column,
      order: defaultSortOption.direction,
    },
  });

  // fn
  // fetch
  useFetchList(params, {
    setState: setPolicyAddList,
    fetchList: fetchUserPolicyAddList,
    setHeaderInfos,
    setList,
    setTotCnt,
  });

  // format - header
  const formatHeaderInfos = (headerInfos: any[]) => {
    return headerInfos?.map((item) => ({
      ...item,
      minWidth:
        item.keyName === "name" || item.keyName === "description"
          ? 200
          : undefined,
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
  const handleSubmit: React.FocusEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (rowSelection.length > 0) {
      try {
        const result = await fetchUserPolicyAdd({
          totCnt: rowSelection.length,
          userId: userId,
          items: rowSelection.map((item) => ({ id: item.id })),
        });

        if (result.header.rtnCode === "000000") {
          openSuccess({
            message: "추가되었습니다.",
            url: "권한 추가",
          });
          onSuccess?.();
        } else {
          openError({
            code: result.header.rtnCode,
            message: result.header.rtnMessage,
            url: "권한 추가",
          });
        }
      } catch (err: any) {
        openError({
          message: err,
        });
      }
    } else {
      openNotify({
        message: "권한을 선택해 주세요.",
        url: "권한 추가",
      });
    }
  };

  useEffect(() => {
    if (error) handleModal(false);
  }, [error, handleModal]);

  return (
    <form
      id="user-policy-add-form"
      onKeyDown={(e) => {
        if ((e as any).isComposing) return;
        if (e.key === "Enter") {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onSubmit={handleSubmit}
    >
      <ul className="modal-form">
        <li>
          <p className="modal-sub-title">
            <span className="id">{userId}</span> 직접 권한 연결
          </p>
          <DataTable
            checkbox={true}
            currentPage={1}
            defaultSortOption={sortOption}
            handleSortChange={handleSortChange}
            headerInfos={formatHeaderInfos(headerInfos)}
            isLoading={loading}
            isMulti={true}
            itemsPerPage={itemsPerPage}
            list={list}
            page={1}
            rowId={"id"}
            setRowSelection={setRowSelection}
            totCnt={totCnt}
            onPageChange={() => {}}
          />
        </li>
      </ul>
    </form>
  );
};

export const UserPolicyAddModal = (
  onSuccess: () => void,
  userId: string,
  setIsPolicyAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
): ModalConfig => ({
  title: "권한 추가",
  content: (
    <UserPolicyAddForm
      handleModal={setIsPolicyAddModalOpen}
      userId={userId}
      onSuccess={onSuccess}
    />
  ),
  closeButton: "닫기",
  confirmButton: "추가",
  formId: "user-policy-add-form",
});
