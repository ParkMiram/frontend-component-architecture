import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { faSquarePlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GridSortDirection } from "@mui/x-data-grid";

import { AddUsersToGroupModal } from "./modal/AddUsersToGroupModal";
import { DeleteUserToGroupModal } from "./modal/DeleteUserToGroupModal";

import {
  fetchUserGroupUserList,
  userGroupUserListAtom,
} from "@/recoil/atoms/userGroup.ts";
import { RowSelection } from "@/types/interface/PageInterface.ts";
import { FetchUserDetailParams } from "@/types/type/PageType.ts";
import { useFetchList } from "@/hooks/fetchListData.ts";
import { Refreshable } from "@/types/type/refresh.ts";
import { useParamsRefetch } from "@/hooks/useParamRefetch.ts";
import { PageTitle } from "@/molecules/Title.tsx";
import { PageContainer } from "@/template/PageContainer.tsx";
import { PageButton, PageButtonBox } from "@/atoms/Button.tsx";
import { PageContent } from "@/template/PageContent.tsx";

const UserGroupUser = ({ state }: { state: any }) => {
  // recoil
  const setUserGroupUserList = useSetRecoilState(userGroupUserListAtom);
  const { loading } = useRecoilValue(userGroupUserListAtom);
  // state
  const [headerInfos, setHeaderInfos] = useState([]);
  const [list, setList] = useState([]);
  const [totCnt, setTotCnt] = useState(0);
  const defaultSortOption = { column: 5, direction: "DESC" }; // 등록 일자
  const itemsPerPage = 10;
  const [sortOption, setSortOption] = useState(defaultSortOption);

  console.log(sortOption);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<RowSelection | null>(null); // row 데이터
  // modal
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false); // 사용자 추가
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false); // 사용자 삭제
  // init
  const [params, setParams] = useState<Refreshable<FetchUserDetailParams>>({
    groupSeq: state.groupSeq,
    list: {
      isHeaderInfo: true,
      rowCnt: itemsPerPage,
      startNum: 0,
      sortIdx: defaultSortOption?.column,
      order: defaultSortOption?.direction,
    },
  });
  // refetch
  const refetchList = useParamsRefetch(setParams);

  // fn
  // fetch
  useFetchList(params, {
    setState: setUserGroupUserList,
    fetchList: fetchUserGroupUserList,
    setHeaderInfos,
    setList,
    setTotCnt,
  });

  // format - header
  const formatHeaderInfos = (headerInfos: any[]) => {
    return headerInfos?.map((item) => ({
      ...item,
      minWidth:
        item.keyName === "regDate" || item.keyName === "userId"
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

  // modal 성공 시
  const handleModalSuccess = () => {
    setIsAddUserModalOpen(false);
    setIsDeleteUserModalOpen(false);
    refetchList();
  };
  const rowData = {
    ...rowSelection,
    groupSeq: state.groupSeq,
    groupId: state.groupId,
  };
  // modal config
  const addUserModalConfig = AddUsersToGroupModal(
    handleModalSuccess,
    state,
    setIsAddUserModalOpen,
  ); // 사용자 추가
  const deleteUserModalConfig = DeleteUserToGroupModal(
    handleModalSuccess,
    rowData,
    setIsDeleteUserModalOpen,
  ); // 사용자 삭제

  console.log(addUserModalConfig, deleteUserModalConfig);

  return (
    <PageContainer>
      <PageContent
        handleSortChange={handleSortChange}
        headerInfos={formatHeaderInfos(headerInfos)}
        isLoading={loading}
        itemsPerPage={itemsPerPage}
        list={list}
        page={currentPage}
        rowId={"userId"}
        setRowSelection={setRowSelection}
        totCnt={totCnt}
        onPageChange={handlePageChange}
      >
        <div className="info-header">
          <PageTitle>그룹에 속한 사용자 목록</PageTitle>
          <PageButtonBox>
            <PageButton
              disabled={!rowSelection}
              icon={faTrash}
              onClick={() => setIsDeleteUserModalOpen(!isDeleteUserModalOpen)}
            >
              삭제
            </PageButton>
            <PageButton
              className="add"
              icon={faSquarePlus}
              onClick={() => setIsAddUserModalOpen(!isAddUserModalOpen)}
            >
              사용자 추가
            </PageButton>
          </PageButtonBox>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default UserGroupUser;
