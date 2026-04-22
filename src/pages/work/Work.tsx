import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Progress,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { Suspense, useEffect, useRef, useState } from "react";
import { Selection } from "@react-types/shared";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay, faSquare } from "@fortawesome/free-solid-svg-icons";

import { ProgramDetail } from "../program/ProgramDetail";

import { PageContainer } from "@/template/PageContainer.tsx";
import { PageTitle } from "@/molecules/Title.tsx";
import { PageContent } from "@/template/PageContent.tsx";
import Search from "@/molecules/Search.tsx";
import { PageButtonBox } from "@/atoms/Button.tsx";
import { ChevronDownIcon } from "@/assets/icons/ChevronDownIcon.tsx";
import BaseModal from "@/organisms/BaseModal.tsx";
import { WorkRegisterModal } from "@/pages/work/modal/WorkRegisterModal.tsx";
import {
  fetchWorkListSelector,
  workListRefreshKeyAtom,
} from "@/recoil/atoms/work.ts";
import { workHeader } from "@/columnHeaders/workHeader.tsx";
import { dateFormat } from "@/utils/dateFormat.ts";
import { WorkStatusChip } from "@/atoms/Chips.tsx";
import BaseDrawer from "@/organisms/BaseDrawer.tsx";
import { WorkDetail } from "@/pages/work/WorkDetail.tsx";
import { SortType } from "@/types/type/SortType.ts";
import BlankColumn from "@/utils/BlankColumn.tsx";
import { addComma } from "@/utils/addComma.ts";

// type
type DetailType =
  | { type: "work"; id: string; from?: "pgm" }
  | { type: "pgm"; id: string; fromWorkId: string };

const Work = () => {
  // ref
  const drawerBodyRef = useRef<HTMLDivElement | null>(null);

  // sort
  const [sortState, setSortState] = useState<SortType>(null);
  // filter
  // 작업 상태
  const workTypeOptions = [
    { id: "ON_STOP|RUNNING", label: "발급 중/중지" },
    { id: "FINISHED", label: "종료" },
  ];
  const [workType, setWorkType] = useState<Selection>(
    new Set([workTypeOptions[0].id]),
  );

  const selectedWorkTypeCount =
    workType === "all" ? workTypeOptions.length : workType.size;

  const selectedStatus = Array.from(workType as Set<string>)[0];

  // search
  const [searchText, setSearchText] = useState<string>("");

  // recoil
  const refreshKey = useRecoilValue(workListRefreshKeyAtom);
  const workInfosLoadable = useRecoilValueLoadable(
    fetchWorkListSelector({
      orderBy: sortState?.orderBy,
      orderDirection: sortState?.orderDirection,
      status:
        (selectedStatus as "ON_STOP|RUNNING" | "FINISHED") ?? "ON_STOP|RUNNING",
      search: searchText,
      _refreshKey: refreshKey,
    }),
  );

  // state
  const list =
    workInfosLoadable.state === "hasValue" ? workInfosLoadable.contents : [];

  const isLoading = workInfosLoadable.state === "loading";
  // page
  const [page, setPage] = useState(1);
  // scroll
  const [scrollToBottom, setScrollToBottom] = useState(false);
  // modal
  const [modal, setModal] = useState<null | "register">(null);
  // modal (작업 등록)
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
  const [detailState, setDetailState] = useState<DetailType | null>(null);

  const detail =
    detailState?.type === "work"
      ? WorkDetail({
          id: detailState.id,
          onMovePgm: (pgmId: string) =>
            setDetailState({
              type: "pgm",
              id: pgmId,
              fromWorkId: detailState.id,
            }),
        })
      : detailState?.type === "pgm"
        ? ProgramDetail({
            id: detailState.id,
            onBack: () => {
              setDetailState({
                type: "work",
                id: detailState.fromWorkId,
                from: "pgm",
              });
              setScrollToBottom(true);
            },
          })
        : null;

  // format - header
  const formatHeaderInfos = (headerInfos: any[]) => {
    return headerInfos?.map((item) => ({
      ...item,
      minWidth:
        item.keyName === "tag_name" || item.keyName === "prj_title"
          ? 300
          : item.keyName === "customer" ||
              item.keyName === "target_size" ||
              item.keyName === "work_proces_rate"
            ? 200
            : item.keyName === "work_start_time" ||
                item.keyName === "due_date" ||
                item.keyName === "reg_date"
              ? 160
              : 150,
    }));
  };

  // format - list
  const formatList = (list: any[]) => {
    return list?.map((item) => ({
      ...item,
      key: String(item.seq),
      work_no: <BlankColumn value={item.work_no} />,
      work_start_time: dateFormat(item.work_start_time),
      status: <WorkStatusChip value={item.status} />,
      target_size: `${addComma(item.target_size) ?? 0} / ${addComma(item.completed_size) ?? 0} / ${addComma(item.remain_size) ?? 0} / ${addComma(item.real_fail) ?? 0}`,
      work_proces_rate: (
        <div className="flex items-center">
          <Progress
            className="flex-1"
            color={
              item.status === "RUNNING"
                ? "primary"
                : item.status === "ON_STOP"
                  ? "warning"
                  : item.status === "FINISHED"
                    ? "success"
                    : "default"
            }
            maxValue={100}
            size="md"
            value={Number(item.work_proces_rate) ?? 0}
          />
          <span className="text-xs w-10 text-right">
            {Number(item.work_proces_rate?.toFixed(2) ?? 0)}%
          </span>
        </div>
      ),
      yield_rate: item.yield_rate === null ? 0 : item.yield_rate,
      due_date: dateFormat(item.due_date),
      reg_date: dateFormat(item.reg_date),
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
  const registerModalConfig = WorkRegisterModal({
    success: handleModalSuccess,
  });

  // drawer open
  const handleOpenDetail = (id: string) => {
    setDetailState({ type: "work", id });
    openDrawer();
  };

  // useEffect
  // 프로그램 상세 -> 작업 정보 - 프로그램 정보로 스크롤 이동
  useEffect(() => {
    if (scrollToBottom && drawerBodyRef.current) {
      requestAnimationFrame(() => {
        const scrollContainer = drawerBodyRef.current?.parentElement;

        if (scrollContainer) {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: "smooth",
          });

          setScrollToBottom(false);
        }
      });
    }
  }, [detailState]);

  return (
    <PageContainer>
      <PageTitle>작업(WORK) 관리</PageTitle>
      <PageContent
        handleSortChange={(keyName, direction) => {
          setSortState({
            orderBy: keyName,
            orderDirection: direction,
          });
        }}
        headerInfos={formatHeaderInfos(workHeader)}
        isLoading={isLoading}
        isMulti={false}
        itemsPerPage={10}
        list={formatList(list)}
        page={page}
        rowId={"wki_uid"}
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
          label="작업명 / 작업 번호 / 주문 번호 / 고객명"
          onPageChange={setPage}
        >
          <Badge
            color={selectedWorkTypeCount > 0 ? "primary" : "default"}
            content={
              selectedWorkTypeCount > 0 ? (
                Array.from(workType)[0] === "FINISHED" ? (
                  <FontAwesomeIcon icon={faSquare} size={"2xs"} />
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPlay} size={"2xs"} />
                    <span>|</span>
                    <FontAwesomeIcon icon={faPause} size={"2xs"} />
                  </>
                )
              ) : (
                "-"
              )
            }
            isOneChar={Array.from(workType)[0] === "FINISHED"}
            size="lg"
          >
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  className="filter"
                  endContent={
                    <ChevronDownIcon className="text-small shrink-0" />
                  }
                  radius="md"
                  size="sm"
                  variant="faded"
                >
                  작업 상태
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={workType}
                selectionMode="single"
                onSelectionChange={setWorkType}
              >
                {workTypeOptions.map((status) => (
                  <DropdownItem key={status.id} className="capitalize">
                    {status.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Badge>
        </Search>
        <PageButtonBox>
          <Button color="primary" variant="shadow" onPress={openRegisterModal}>
            작업 등록
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
      {detailState && detail && (
        <BaseDrawer
          bodyRef={drawerBodyRef}
          button={detail.button}
          isOpen={isDrawerOpen}
          leftButton={detail.leftButton}
          title={detail.title}
          onOpenChange={(open) => {
            onDrawerOpenChange();
            if (!open) setDetailState(null);
          }}
        >
          <Suspense fallback={<Spinner />}>{detail.content}</Suspense>
        </BaseDrawer>
      )}
    </PageContainer>
  );
};

export default Work;
