import { Button } from "@heroui/react";

import { PageContainer } from "@/template/PageContainer.tsx";
import { PageContent } from "@/template/PageContent.tsx";
import { PageTitle } from "@/molecules/Title.tsx";
import { PageButtonBox } from "@/atoms/Button.tsx";

const UserGroup = ({}: { userId?: string }) => {
  // recoil
  // const setUserGroupList = useSetRecoilState(userGroupListAtom);
  // const { loading, error } = useRecoilValue(userGroupListAtom);
  // // state
  // const [headerInfos, setHeaderInfos] = useState([]);
  // const [list, setList] = useState<any[]>([]);
  // const [totCnt, setTotCnt] = useState(0);
  // const defaultSortOption = { key: 4, order: "DESC" }; // 등록 일자
  // const itemsPerPage = 5;
  // const [sortOption, setSortOption] = useState(defaultSortOption);
  // const [currentPage, setCurrentPage] = useState(1);
  // const [rowSelection, setRowSelection] = useState<RowSelection | null>(null); // row 데이터
  // // modal
  // const [isAddUserGroupsOpen, setIsAddUserGroupsOpen] = useState(false);
  // const [isDeleteUserGroupsOpen, setIsDeleteUserGroupsOpen] = useState(false);
  // init
  // const [params, setParams] = useState({
  //   userId: userId,
  //   list: {
  //     isHeaderInfo: true,
  //     rowCnt: itemsPerPage,
  //     startNum: 0,
  //     sortIdx: defaultSortOption.key,
  //     order: defaultSortOption.order,
  //   },
  // });
  // refetch
  // const refetchList = useParamsRefetch(setParams);

  // fn
  // fetch
  // useFetchList(params, {
  //   setState: setUserGroupList,
  //   fetchList: fetchUserGroupList,
  //   setHeaderInfos,
  //   setList,
  //   setTotCnt,
  // });

  // pagination
  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  //   setParams((p) => ({
  //     ...p,
  //     startNum: (page - 1) * itemsPerPage,
  //     rowCnt: itemsPerPage,
  //   }));
  // };

  // sort
  // const handleSortChange = (
  //   key: string | number | undefined,
  //   direction: GridSortDirection,
  // ) => {
  //   if (!direction || typeof key !== "number") return; // 초기화된 경우 무시
  //   setSortOption({ key, order: direction.toUpperCase() });
  //   setParams((p) => ({ ...p, sortIdx: key, order: direction.toUpperCase() }));
  // };

  // modal 성공 시
  // const handleModalSuccess = () => {
  //   setIsAddUserGroupsOpen(false);
  //   setIsDeleteUserGroupsOpen(false);
  //   refetchList();
  // };
  // modal config
  // const addGroupModalConfig = AddableUserGroups(
  //   handleModalSuccess,
  //   userId as string,
  //   setIsAddUserGroupsOpen,
  // );
  // const deleteGroupModalConfig = DeleteUserGroupModal(
  //   handleModalSuccess,
  //   userId as string,
  //   rowSelection,
  //   setIsDeleteUserGroupsOpen,
  // );

  return (
    <PageContainer>
      <PageContent
        handleSortChange={() => {}}
        headerInfos={[]}
        list={[]}
        page={1}
        rowId={"1"}
        onPageChange={() => {}}
      >
        <PageTitle>사용자 그룹</PageTitle>
        <PageButtonBox>
          <Button
            color="default"
            // isDisabled={rowSelection === null}
            variant="solid"
            // onPress={openRemoveModal}
          >
            삭제
          </Button>
          <Button
            color="primary"
            variant="shadow"
            // onPress={openRegisterModal}
          >
            사용자 그룹 추가
          </Button>
        </PageButtonBox>
      </PageContent>
    </PageContainer>
  );
};

export default UserGroup;
