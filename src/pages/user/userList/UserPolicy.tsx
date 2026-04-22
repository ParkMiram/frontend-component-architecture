import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { faSquarePlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GridSortDirection } from "@mui/x-data-grid";

import { UserPolicyAddModal } from "./modal/UserPolicyAddModal";
import { UserPolicyDeleteModal } from "./modal/UserPolicyDeleteModal";

import { PageContainer } from "@/template/PageContainer.tsx";
import { PageTitle } from "@/molecules/Title.tsx";
import { PageContent } from "@/template/PageContent.tsx";
import {
  fetchUserPolicyList,
  userPolicyListAtom,
} from "@/recoil/atoms/user.ts";
import { RowSelection } from "@/types/interface/PageInterface.ts";
import { useFetchList } from "@/hooks/fetchListData.ts";
import { PageButton, PageButtonBox } from "@/atoms/Button.tsx";
import { Refreshable } from "@/types/type/refresh.ts";
import { FetchUserDetailParams } from "@/types/type/PageType.ts";
import { useParamsRefetch } from "@/hooks/useParamRefetch.ts";

const UserPolicy = ({ userId }: { userId?: string }) => {
  // recoil
  const setUserPolicyList = useSetRecoilState(userPolicyListAtom);
  const { loading } = useRecoilValue(userPolicyListAtom);
  // state
  const [headerInfos, setHeaderInfos] = useState([]);
  const [list, setList] = useState<any[]>([]);
  const [totCnt, setTotCnt] = useState(0);
  const defaultSortOption = { column: 5, direction: "DESC" }; // 등록 일자
  const itemsPerPage = 5;
  const [sortOption, setSortOption] = useState(defaultSortOption);

  console.log(sortOption);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<RowSelection | null>(null); // row 데이터
  // modal
  const [isPolicyAddModalOpen, setIsPolicyAddModalOpen] = useState(false); // 권한 추가
  const [isPolicyDeleteModalOpen, setIsPolicyDeleteModalOpen] = useState(false); // 권한 삭제
  // init
  const [params, setParams] = useState<Refreshable<FetchUserDetailParams>>({
    userId: userId,
    list: {
      isHeaderInfo: true,
      rowCnt: itemsPerPage,
      startNum: 0,
      sortIdx: defaultSortOption.column,
      order: defaultSortOption.direction,
    },
  });
  // refetch
  const refetchList = useParamsRefetch(setParams);

  // fn
  // fetch
  useFetchList(params, {
    setState: setUserPolicyList,
    fetchList: fetchUserPolicyList,
    setHeaderInfos,
    setList,
    setTotCnt,
  });

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
    setIsPolicyAddModalOpen(false);
    setIsPolicyDeleteModalOpen(false);
    refetchList();
  };
  // modal config
  const policyAddModalConfig = UserPolicyAddModal(
    handleModalSuccess,
    userId as string,
    setIsPolicyAddModalOpen,
  );
  const policyDeleteModalConfig = UserPolicyDeleteModal(
    handleModalSuccess,
    userId as string,
    rowSelection,
    setIsPolicyDeleteModalOpen,
  );

  console.log(policyAddModalConfig, policyDeleteModalConfig);

  return (
    <PageContainer>
      <PageContent
        handleSortChange={handleSortChange}
        headerInfos={headerInfos}
        isLoading={loading}
        itemsPerPage={itemsPerPage}
        list={list}
        page={currentPage}
        rowId={"id"}
        setRowSelection={setRowSelection}
        totCnt={totCnt}
        onPageChange={handlePageChange}
      >
        <div className="info-header">
          <PageTitle>
            권한
            <span>- 사용자에 할당된 권한</span>
          </PageTitle>
          <PageButtonBox>
            <PageButton
              disabled={!rowSelection}
              icon={faTrash}
              onClick={() =>
                setIsPolicyDeleteModalOpen(!isPolicyDeleteModalOpen)
              }
            >
              삭제
            </PageButton>
            <PageButton
              className="add"
              icon={faSquarePlus}
              onClick={() => setIsPolicyAddModalOpen(!isPolicyAddModalOpen)}
            >
              권한 추가
            </PageButton>
          </PageButtonBox>
        </div>
      </PageContent>
      {/*{isPolicyAddModalOpen && (*/}
      {/*  <Modal*/}
      {/*    config={policyAddModalConfig}*/}
      {/*    onClose={setIsPolicyAddModalOpen}*/}
      {/*  />*/}
      {/*)}*/}
      {/*{isPolicyDeleteModalOpen && (*/}
      {/*  <Modal*/}
      {/*    config={policyDeleteModalConfig}*/}
      {/*    onClose={setIsPolicyDeleteModalOpen}*/}
      {/*  />*/}
      {/*)}*/}
    </PageContainer>
  );
};

export default UserPolicy;
