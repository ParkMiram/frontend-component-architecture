import { useEffect, useState } from "react";
import { faSquarePlus, faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GridSortDirection } from "@mui/x-data-grid";

import { RemoveUserGroupModal } from "./modal/RemoveUserGroupModal";
import { CreateUserGroupModal } from "./modal/CreateUserGroupModal";

import { PageContent } from "@/template/PageContent.tsx";
import { PageButton, PageButtonBox } from "@/atoms/Button.tsx";
import { PageContainer } from "@/template/PageContainer.tsx";
import { RowSelection } from "@/types/interface/PageInterface.ts";
import { FetchUserListParams } from "@/types/type/PageType.ts";
import { PageTitle } from "@/molecules/Title.tsx";
import {
  fetchUserGroupList,
  userGroupListAtom,
} from "@/recoil/atoms/userGroup.ts";
import { useFetchList } from "@/hooks/fetchListData.ts";
import { Refreshable } from "@/types/type/refresh.ts";
import { useParamsRefetch } from "@/hooks/useParamRefetch.ts";
import { useErrorModal } from "@/hooks/useCustomModal.ts";
import { HmacBadge } from "@/atoms/Badge.tsx";

const UserGroup = () => {
  // var
  const { openError } = useErrorModal();
  // recoil
  const setUserGroupList = useSetRecoilState(userGroupListAtom);
  const { loading, error } = useRecoilValue(userGroupListAtom);
  // state
  const [headerInfos, setHeaderInfos] = useState([]);
  const [list, setList] = useState([]);
  const [totCnt, setTotCnt] = useState(0);
  const defaultSortOption = { column: 6, direction: "DESC" }; // 업데이트 일자
  const itemsPerPage = 10;
  const [sortOption, setSortOption] = useState(defaultSortOption);

  console.log(sortOption);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<RowSelection | null>(null); // row 데이터
  // modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // 그룹 생성
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false); // 그룹 삭제
  // init
  const [params, setParams] = useState<Refreshable<FetchUserListParams>>({
    isHeaderInfo: true,
    rowCnt: itemsPerPage,
    startNum: 0,
    sortIdx: defaultSortOption.column,
    order: defaultSortOption.direction,
    filter: null,
  });
  // refetch
  const refetchList = useParamsRefetch(setParams);

  // fn
  // fetch
  useFetchList(params, {
    setState: setUserGroupList,
    fetchList: fetchUserGroupList,
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
        item.keyName === "updateDate" ||
        item.keyName === "userId"
          ? 160
          : undefined,
    }));
  };

  // format - list
  const formatList = (list: any[]) => {
    return list?.map((item) => ({
      ...item,
      hmacResult: <HmacBadge hmac={item.hmacResult} />,
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
    setIsCreateModalOpen(false);
    setIsRemoveModalOpen(false);
    refetchList();
  };

  // modal config
  const createModalConfig = CreateUserGroupModal(
    handleModalSuccess,
    setIsCreateModalOpen,
  ); // 그룹 생성
  const removeModalConfig = RemoveUserGroupModal(
    handleModalSuccess,
    setIsRemoveModalOpen,
    rowSelection,
  ); // 그룹 삭제

  console.log(createModalConfig, removeModalConfig);

  // useEffect
  useEffect(() => {
    if (error) {
      openError({
        code: error.code,
        message: error.message,
        url: "사용자 그룹 목록",
      });
    }
  }, [error, openError]);

  return (
    <PageContainer>
      <PageTitle>사용자 그룹 목록</PageTitle>
      <PageContent
        handleSortChange={handleSortChange}
        headerInfos={formatHeaderInfos(headerInfos)}
        isLoading={loading}
        itemsPerPage={itemsPerPage}
        list={formatList(list)}
        page={currentPage}
        rowId={"groupId"}
        setRowSelection={setRowSelection}
        totCnt={totCnt}
        onPageChange={handlePageChange}
      >
        <div className="search-filter-container">
          <span>
            사용자 그룹을 사용하여 그룹에 속한 사용자에게 권한을 지정합니다.
          </span>
        </div>
        <PageButtonBox>
          <PageButton
            disabled={!rowSelection}
            icon={faSquareXmark}
            onClick={() => setIsRemoveModalOpen(!isRemoveModalOpen)}
          >
            삭제
          </PageButton>
          <PageButton
            className="add"
            icon={faSquarePlus}
            onClick={() => setIsCreateModalOpen(!isCreateModalOpen)}
          >
            그룹 생성
          </PageButton>
        </PageButtonBox>
      </PageContent>
    </PageContainer>
  );
};

export default UserGroup;
