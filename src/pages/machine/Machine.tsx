import { useRecoilValueLoadable } from "recoil";
import { Suspense, useCallback, useState } from "react";
import { Button, Spinner, useDisclosure } from "@heroui/react";

import { PageTitle } from "@/molecules/Title.tsx";
import { PageContent } from "@/template/PageContent.tsx";
import Search from "@/molecules/Search.tsx";
import { PageContainer } from "@/template/PageContainer.tsx";
import { fetchMachineListSelector } from "@/recoil/atoms/machine.ts";
import { machineHeader } from "@/columnHeaders/machineHeader.tsx";
import { dateFormat } from "@/utils/dateFormat.ts";
import { MachineDetail } from "@/pages/machine/MachineDetail.tsx";
import BaseDrawer from "@/organisms/BaseDrawer.tsx";
import DeviceByMachine from "@/pages/machine/DeviceByMachine.tsx";
import { PageButtonBox } from "@/atoms/Button.tsx";
import BaseModal from "@/organisms/BaseModal.tsx";
import { AddDeviceModal } from "@/pages/machine/modal/AddDeviceModal.tsx";
import { EditDeviceModal } from "@/pages/machine/modal/EditDeviceModal.tsx";
import { RegisterMachineModal } from "@/pages/machine/modal/RegisterMachineModal.tsx";

const Machine = () => {
  // search
  const [searchText, setSearchText] = useState<string>("");

  // recoil
  const machineLoadable = useRecoilValueLoadable(
    fetchMachineListSelector({ search: searchText }),
  );

  // state
  const list =
    machineLoadable.state === "hasValue" ? machineLoadable.contents : [];
  const isLoading = machineLoadable.state === "loading";
  // page
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string>("");
  // accordion 펼침
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  // 디바이스
  const [selectedMcnUid, setSelectedMcnUid] = useState<string>("");
  const [selectedIps, setSelectedIps] = useState<string[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<any>([]);

  // drawer (상세)
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onOpenChange: onDrawerOpenChange,
  } = useDisclosure();
  const detail = selectedId ? MachineDetail({ id: selectedId }) : null;

  // modal (발급장비 등록, 디바이스 추가, 디바이스 수정)
  const [modal, setModal] = useState<null | "register" | "add" | "edit">(null);
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onOpenChange: onModalOpenChange,
    onClose: closeModal,
  } = useDisclosure();

  // fn
  // format - header
  const formatHeaderInfos = (headerInfos: any[]) => {
    return headerInfos?.map((item) => ({
      ...item,
      minWidth: item.keyName === "name" ? "auto" : 150,
    }));
  };

  // format - list
  const formatList = (list: any[]) => {
    return list?.map((item) => ({
      ...item,
      key: String(item.seq),
      name: (
        <DeviceByMachine
          addModal={openAddDeviceModal}
          editModal={openEditDeviceModal}
          expandedKeys={expandedKeys}
          mcnName={item.mcn_uid}
          setExpandedKeys={setExpandedKeys}
        />
      ),
      updt_date: dateFormat(item.updt_date),
      reg_date: dateFormat(item.reg_date),
    }));
  };

  // drawer open
  const handleOpenDetail = (id: string) => {
    setSelectedId(id);
    openDrawer();
  };

  // modal - 발급장비 등록
  const openRegisterMachineModal = () => {
    setModal("register");
    openModal();
  };

  // modal - 디바이스 추가
  const openAddDeviceModal = useCallback(
    (uid: string, ips: string[]) => {
      setSelectedMcnUid(uid);
      setSelectedIps(ips);
      setModal("add");
      openModal();
    },
    [openModal],
  );

  // modal - 디바이스 수정
  const openEditDeviceModal = useCallback(
    (info: any) => {
      setDeviceInfo(info);
      setModal("edit");
      openModal();
    },
    [openModal],
  );

  // modal success
  const handleModalSuccess = () => {
    closeModal();
  };

  // modal config - 발급장비 등록
  const registerMachineModalConfig = RegisterMachineModal({
    success: handleModalSuccess,
  });

  // modal config - 디바이스 추가
  const addDeviceModalConfig = AddDeviceModal({
    mcnUid: selectedMcnUid,
    ips: selectedIps,
    success: handleModalSuccess,
  });

  // modal config - 디바이스 수정
  const editDeviceModalConfig = EditDeviceModal({
    info: deviceInfo,
    success: handleModalSuccess,
  });

  return (
    <PageContainer>
      <PageTitle>발급장비 관리</PageTitle>
      <PageContent
        handleSortChange={() => {}}
        headerInfos={formatHeaderInfos(machineHeader)}
        isLoading={isLoading}
        isMulti={false}
        isSorting={false}
        itemsPerPage={10}
        list={formatList(list)}
        page={page}
        rowId={"mcn_uid"}
        onClickDetail={handleOpenDetail}
        onPageChange={setPage}
      >
        <Search
          handleFilterChange={setSearchText}
          label="Search"
          onPageChange={setPage}
        />
        <PageButtonBox>
          <Button
            color="primary"
            variant="shadow"
            onPress={openRegisterMachineModal}
          >
            발급장비 등록
          </Button>
        </PageButtonBox>
      </PageContent>
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
      {modal && (
        <BaseModal
          key={modal}
          config={
            modal === "add"
              ? addDeviceModalConfig
              : modal === "edit"
                ? editDeviceModalConfig
                : modal === "register"
                  ? registerMachineModalConfig
                  : null
          }
          isOpen={isModalOpen}
          onOpenChange={(open) => {
            onModalOpenChange();
            if (!open) setModal(null);
          }}
        />
      )}
    </PageContainer>
  );
};

export default Machine;
