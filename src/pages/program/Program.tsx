import { Button, Spinner, useDisclosure } from "@heroui/react";
import { Suspense, useState } from "react";
import { useRecoilValueLoadable } from "recoil";

import { PageContainer } from "@/template/PageContainer.tsx";
import { PageTitle } from "@/molecules/Title.tsx";
import { PageContent } from "@/template/PageContent.tsx";
import Search from "@/molecules/Search.tsx";
import { PageButtonBox } from "@/atoms/Button.tsx";
import BaseModal from "@/organisms/BaseModal.tsx";
import { ProgramRegisterModal } from "@/pages/program/modal/ProgramRegisterModal.tsx";
import { fetchProgramListSelector } from "@/recoil/atoms/program.ts";
import { programHeader } from "@/columnHeaders/programHeader.tsx";
import { dateFormat } from "@/utils/dateFormat.ts";
import { ProgramDetail } from "@/pages/program/ProgramDetail.tsx";
import BaseDrawer from "@/organisms/BaseDrawer.tsx";
import { ProgramStatusChip } from "@/atoms/Chips.tsx";
import { SortType } from "@/types/type/SortType.ts";

const Program = () => {
  // sort
  const [sortState, setSortState] = useState<SortType>(null);

  // search
  const [searchText, setSearchText] = useState<string>("");

  // recoil
  const programLoadable = useRecoilValueLoadable(
    fetchProgramListSelector({
      orderBy: sortState?.orderBy,
      orderDirection: sortState?.orderDirection,
      search: searchText,
    }),
  );

  // state
  const list =
    programLoadable.state === "hasValue" ? programLoadable.contents : [];
  const isLoading = programLoadable.state === "loading";
  // page
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string>("");

  // modal
  const [modal, setModal] = useState<null | "register">(null);
  // modal (프로그램 등록)
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
  const detail = selectedId ? ProgramDetail({ id: selectedId }) : null;

  // format - header
  const formatHeaderInfos = (headerInfos: any[]) => {
    return headerInfos?.map((item) => ({
      ...item,
      minWidth:
        item.keyName === "name" || item.keyName === "profile_name" ? 300 : 150,
    }));
  };

  // format - list
  const formatList = (list: any[]) => {
    return list?.map((item) => ({
      ...item,
      key: String(item.seq),
      updt_date: dateFormat(item.updt_date),
      reg_date: dateFormat(item.reg_date),
      status: <ProgramStatusChip value={item.status} />,
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
  const registerModalConfig = ProgramRegisterModal({
    success: handleModalSuccess,
  });

  // drawer open
  const handleOpenDetail = (id: string) => {
    setSelectedId(id);
    openDrawer();
  };

  return (
    <PageContainer>
      <PageTitle>프로그램(PGM) 관리</PageTitle>
      <PageContent
        handleSortChange={(keyName, direction) => {
          setSortState({
            orderBy: keyName,
            orderDirection: direction,
          });
        }}
        headerInfos={formatHeaderInfos(programHeader)}
        isLoading={isLoading}
        isMulti={false}
        itemsPerPage={10}
        list={formatList(list)}
        page={page}
        rowId={"pji_uid"}
        sortDescriptor={
          sortState
            ? {
                column: sortState.orderBy,
                direction:
                  sortState.orderDirection === "asc"
                    ? "ascending"
                    : "descending",
              }
            : undefined
        }
        onClickDetail={handleOpenDetail}
        onPageChange={setPage}
      >
        <Search
          handleFilterChange={setSearchText}
          label="프로젝트명 / 번호 / 설명"
          onPageChange={setPage}
        />
        <PageButtonBox>
          <Button color="primary" variant="shadow" onPress={openRegisterModal}>
            프로그램 등록
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
          button={detail.button}
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

export default Program;
