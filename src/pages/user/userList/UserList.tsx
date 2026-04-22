import { Suspense, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Button, Spinner, useDisclosure } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faMinus } from "@fortawesome/free-solid-svg-icons";

import Search from "../../../molecules/Search";
import BaseModal from "../../../organisms/BaseModal.tsx";

import { UserRegisterModal } from "./modal/UserRegisterModal";

import { PageContent } from "@/template/PageContent.tsx";
import { PageButtonBox } from "@/atoms/Button.tsx";
import { FetchListParams } from "@/types/type/PageType.ts";
import { useFetchList } from "@/hooks/fetchListData.ts";
import { Refreshable } from "@/types/type/refresh.ts";
import { useParamsRefetch } from "@/hooks/useParamRefetch.ts";
import { PageTitle } from "@/molecules/Title.tsx";
import { PageContainer } from "@/template/PageContainer.tsx";
import { RowSelection } from "@/types/interface/PageInterface.ts";
import { fetchUserList, userListAtom } from "@/recoil/atoms/user.ts";
import { StatusChip } from "@/atoms/Chips.tsx";
import BaseDrawer from "@/organisms/BaseDrawer.tsx";
import { UserDetail } from "@/pages/user/userList/UserDetail.tsx";

const UserList = () => {
  // recoil
  const setUserList = useSetRecoilState(userListAtom);
  const { loading } = useRecoilValue(userListAtom);

  // state
  const [headerInfos, setHeaderInfos] = useState([]);
  const [list, setList] = useState<any[]>([]);
  const [totCnt, setTotCnt] = useState(0);
  const itemsPerPage = 10;
  // const [sortOption, setSortOption] = useState<SortDescriptor>({
  //   column: "update",
  //   direction: "descending",
  // }); // 업데이트 일자
  const [rowSelection, setRowSelection] = useState<RowSelection | null>(null); // row 데이터
  const [selectedId, setSelectedId] = useState<string>("");

  // modal
  const [modal, setModal] = useState<null | "register" | "remove">(null);
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onOpenChange: onModalOpenChange,
    onClose: closeModal,
  } = useDisclosure();

  // drawer (상세)
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onOpenChange: onDrawerOpenChange,
  } = useDisclosure();
  const detail = selectedId
    ? UserDetail({
        id: selectedId,
      })
    : null;

  // init
  const [params, setParams] = useState<Refreshable<FetchListParams>>({
    isHeaderInfo: true,
    rowCnt: itemsPerPage,
    startNum: 0,
    sortKeyName: 6,
    order: "DESC",
    filter: null,
  });

  const refetchList = useParamsRefetch(setParams);

  // fn
  // fetch
  useFetchList(params, {
    setState: setUserList,
    fetchList: fetchUserList,
    setHeaderInfos,
    setList,
    setTotCnt,
  });

  // format - header
  const formatHeaderInfos = (headerInfos: any[]) => {
    return headerInfos?.map((item) => ({
      ...item,
      minWidth: item.keyName === "period" ? 200 : 150,
    }));
  };

  // format - list
  const formatList = (list: any[]) => {
    return list?.map((item) => ({
      ...item,
      __rowKey: String(item.userId),
      period:
        item.period === null ? (
          <FontAwesomeIcon color="var(--gray-500)" icon={faMinus} size="xs" />
        ) : (
          item.period
        ),
      status: <StatusChip value={item} />,
      hmacResult: (
        <>
          <FontAwesomeIcon
            color={item.hmacResult ? "#17C964" : "#F31260"}
            icon={faCircle}
            size="2xs"
          />
          <span className="pl-1">{item.hmacResult ? "OK" : "NONE"}</span>
        </>
      ),
    }));
  };

  // modal open
  const openRegisterModal = () => {
    setModal("register");
    openModal();
  };
  const openRemoveModal = () => {
    setModal("remove");
    openModal();
  };

  // modal success
  const handleModalSuccess = () => {
    closeModal();
    refetchList();
    setRowSelection(null);
  };

  // modal config
  const registerModalConfig = UserRegisterModal({
    success: handleModalSuccess,
  });
  // const removeModalConfig = UserRemoveModal({
  //   row: rowSelection,
  //   success: handleModalSuccess,
  // });

  // drawer open
  const handleOpenDetail = (id: string) => {
    setSelectedId(id);
    openDrawer();
  };

  return (
    <PageContainer>
      <PageTitle>사용자 목록</PageTitle>
      <PageContent
        handleSortChange={() => {}}
        headerInfos={formatHeaderInfos(headerInfos)}
        isLoading={loading}
        itemsPerPage={itemsPerPage}
        list={formatList(list)}
        page={1}
        rowId={"userId"}
        setRowSelection={setRowSelection}
        totCnt={totCnt}
        onClickDetail={handleOpenDetail}
        onPageChange={() => {}}
      >
        <Search
          handleFilterChange={() => {}}
          label="사용자 ID"
          onPageChange={() => {}}
        />
        <PageButtonBox>
          <Button
            color="default"
            isDisabled={rowSelection === null}
            variant="solid"
            onPress={openRemoveModal}
          >
            삭제
          </Button>
          <Button color="primary" variant="shadow" onPress={openRegisterModal}>
            사용자 등록
          </Button>
        </PageButtonBox>
      </PageContent>
      {modal && (
        <BaseModal
          key={modal}
          config={
            // modal === "register" ? registerModalConfig : removeModalConfig
            modal === "register" ? registerModalConfig : null
          }
          isOpen={isModalOpen}
          onOpenChange={(open) => {
            onModalOpenChange();
            if (!open) setModal(null);
          }}
        />
      )}
      {selectedId && detail && (
        <BaseDrawer
          isOpen={isDrawerOpen}
          title={detail.title}
          onOpenChange={(open) => {
            onDrawerOpenChange();
            if (!open) setSelectedId("");
          }}
        >
          <Suspense fallback={<Spinner />}>{detail.content}</Suspense>
        </BaseDrawer>
      )}
    </PageContainer>
  );
};

export default UserList;
