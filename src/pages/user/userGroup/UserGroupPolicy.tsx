import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { faSquarePlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { GridSortDirection } from "@mui/x-data-grid";

import { AddPoliciesToGroupModal } from "./modal/AddPoliciesToGroupModal";
import { DeletePolicyToGroupModal } from "./modal/DeletePolicyToGroupModal";

import {
  fetchUserGroupPolicyList,
  userGroupPolicyListAtom,
} from "@/recoil/atoms/userGroup.ts";
import { RowSelection } from "@/types/interface/PageInterface.ts";
import { Refreshable } from "@/types/type/refresh.ts";
import { FetchUserDetailParams } from "@/types/type/PageType.ts";
import { useParamsRefetch } from "@/hooks/useParamRefetch.ts";
import { useFetchList } from "@/hooks/fetchListData.ts";
import { PageContainer } from "@/template/PageContainer.tsx";
import { PageContent } from "@/template/PageContent.tsx";
import { PageTitle } from "@/molecules/Title.tsx";
import { PageButton, PageButtonBox } from "@/atoms/Button.tsx";

const UserGroupPolicy = ({ state }: { state: any }) => {
  // recoil
  const setUserGroupPolicyList = useSetRecoilState(userGroupPolicyListAtom);
  const { loading } = useRecoilValue(userGroupPolicyListAtom);
  // state
  const [headerInfos, setHeaderInfos] = useState([]);
  const [list, setList] = useState([]);
  const [totCnt, setTotCnt] = useState(0);
  const defaultSortOption = { column: 3, direction: "DESC" }; // 등록 일자
  const itemsPerPage = 10;
  const [sortOption, setSortOption] = useState(defaultSortOption);

  console.log(sortOption);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowSelection, setRowSelection] = useState<RowSelection | null>(null); // row 데이터
  // modal
  const [isAddPolicyModalOpen, setIsAddPolicyModalOpen] = useState(false); // 권한 추가
  const [isDeletePolicyModalOpen, setIsDeletePolicyModalOpen] = useState(false); // 권한 삭제
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
    setState: setUserGroupPolicyList,
    fetchList: fetchUserGroupPolicyList,
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
          ? 180
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
    setIsAddPolicyModalOpen(false);
    setIsDeletePolicyModalOpen(false);
    refetchList();
  };
  const rowData = {
    ...rowSelection,
    groupSeq: state.groupSeq,
  };
  // modal config
  const addPolicyModalConfig = AddPoliciesToGroupModal(
    handleModalSuccess,
    state,
    setIsAddPolicyModalOpen,
  ); // 권한 추가
  const deletePolicyModalConfig = DeletePolicyToGroupModal(
    handleModalSuccess,
    rowData,
    setIsDeletePolicyModalOpen,
  ); // 권한 삭제

  console.log(addPolicyModalConfig, deletePolicyModalConfig);

  return (
    <PageContainer>
      <PageContent
        handleSortChange={handleSortChange}
        headerInfos={formatHeaderInfos(headerInfos)}
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
          <PageTitle>그룹에 할당된 권한</PageTitle>
          <PageButtonBox>
            <PageButton
              disabled={!rowSelection}
              icon={faTrash}
              onClick={() =>
                setIsDeletePolicyModalOpen(!isDeletePolicyModalOpen)
              }
            >
              삭제
            </PageButton>
            <PageButton
              className="add"
              icon={faSquarePlus}
              onClick={() => setIsAddPolicyModalOpen(!isAddPolicyModalOpen)}
            >
              권한 추가
            </PageButton>
          </PageButtonBox>
        </div>
      </PageContent>
    </PageContainer>
  );
};

export default UserGroupPolicy;
