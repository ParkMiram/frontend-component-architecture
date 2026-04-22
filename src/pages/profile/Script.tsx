import { Button, Spinner, useDisclosure } from "@heroui/react";
import { Suspense, useState } from "react";
import { useRecoilValueLoadable } from "recoil";

import { PageContainer } from "@/template/PageContainer.tsx";
import { PageTitle } from "@/molecules/Title.tsx";
import { PageContent } from "@/template/PageContent.tsx";
import Search from "@/molecules/Search.tsx";
import { PageButtonBox } from "@/atoms/Button.tsx";
import { ProfileRegisterModal } from "@/pages/profile/modal/ProfileRegisterModal.tsx";
import BaseModal from "@/organisms/BaseModal.tsx";
import { fetchScriptListSelector } from "@/recoil/atoms/profile.ts";
import { profileHeader } from "@/columnHeaders/profileHeader.tsx";
import { dateFormat } from "@/utils/dateFormat.ts";
import BlankColumn from "@/utils/BlankColumn.tsx";
import BaseDrawer from "@/organisms/BaseDrawer.tsx";
import { ProfileDetail } from "@/pages/profile/ProfileDetail.tsx";

const Script = () => {
  // search
  const [searchText, setSearchText] = useState<string>("");

  // recoil
  const scriptLoadable = useRecoilValueLoadable(
    fetchScriptListSelector({
      type: "script",
      search: searchText,
    }),
  );

  // state
  const list =
    scriptLoadable.state === "hasValue" ? scriptLoadable.contents : [];
  const isLoading = scriptLoadable.state === "loading";
  // page
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string>("");
  // modal
  const [modal, setModal] = useState<null | "register">(null);
  // modal (스크립트 등록)
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
  const detail = selectedId ? ProfileDetail({ id: selectedId }) : null;

  // format - header
  const formatHeaderInfos = (headerInfos: any[]) => {
    return headerInfos?.map((item) => ({
      ...item,
      minWidth:
        item.keyName === "name" || item.keyName === "hash"
          ? 300
          : item.keyName === "description"
            ? 200
            : 150,
    }));
  };

  // format - list
  const formatList = (list: any[]) => {
    return list?.map((item) => ({
      ...item,
      key: String(item.seq),
      updt_date: dateFormat(item.updt_date),
      reg_date: dateFormat(item.reg_date),
      description: <BlankColumn value={item.description} />,
      version: <BlankColumn value={item.version} />,
    }));
  };

  // modal open
  const openRegisterModal = () => {
    setModal("register");
    openModal();
  };

  // modal success
  const handleModalSuccess = () => {
    closeModal();
  };

  // modal config
  const registerModalConfig = ProfileRegisterModal({
    success: handleModalSuccess,
  });

  // drawer open
  const handleOpenDetail = (id: string) => {
    setSelectedId(id);
    openDrawer();
  };

  return (
    <PageContainer>
      <PageTitle>스크립트 관리</PageTitle>
      <PageContent
        handleSortChange={() => {}}
        headerInfos={formatHeaderInfos(profileHeader)}
        isLoading={isLoading}
        isMulti={false}
        isSorting={false}
        itemsPerPage={10}
        list={formatList(list)}
        page={page}
        rowId={"ctn_uid"}
        onClickDetail={handleOpenDetail}
        onPageChange={setPage}
      >
        <Search
          handleFilterChange={setSearchText}
          label="이름 / 설명 / 타입 / 버전"
          onPageChange={setPage}
        />
        <PageButtonBox>
          <Button color="primary" variant="shadow" onPress={openRegisterModal}>
            스크립트 등록
          </Button>
        </PageButtonBox>
      </PageContent>
      {modal && (
        <BaseModal
          key={modal}
          config={modal === "register" ? registerModalConfig : null}
          isOpen={isModalOpen}
          onOpenChange={(open) => {
            onModalOpenChange();
            if (!open) setModal(null);
          }}
        />
      )}
      {detail && (
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

export default Script;
