import { useRecoilValueLoadable } from "recoil";
import { Spinner, useDisclosure } from "@heroui/react";
import { Suspense, useState } from "react";

import { PageContainer } from "@/template/PageContainer.tsx";
import { PageTitle } from "@/molecules/Title.tsx";
import { fetchSessionSelector } from "@/recoil/atoms/session.ts";
import { PageContent } from "@/template/PageContent.tsx";
import { sessionHeader } from "@/columnHeaders/sessionHeader.tsx";
import { dateFormat } from "@/utils/dateFormat.ts";
import Search from "@/molecules/Search.tsx";
import { SessionDetail } from "@/pages/session/SessionDetail.tsx";
import BaseDrawer from "@/organisms/BaseDrawer.tsx";

const Session = () => {
  // recoil
  const sessionListLoadable = useRecoilValueLoadable(fetchSessionSelector);

  // state
  const list =
    sessionListLoadable.state === "hasValue"
      ? sessionListLoadable.contents
      : [];
  const isLoading = sessionListLoadable.state === "loading";
  // page
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string>("");

  // drawer (상세)
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const detail = selectedId
    ? SessionDetail({
        id: selectedId,
      })
    : null;

  const formatHeaderInfos = (headerInfos: any[]) => {
    return headerInfos?.map((item) => ({
      ...item,
      minWidth:
        item.keyName === "session_no" || item.keyName === "work_no"
          ? 250
          : item.keyName === "chip_sn"
            ? 300
            : 150,
    }));
  };

  // format = list
  const formatList = (list: any[]) => {
    return list?.map((item) => ({
      ...item,
      key: String(item.seq),
      updt_date: dateFormat(item.updt_date),
      reg_date: dateFormat(item.reg_date),
    }));
  };

  // drawer open
  const handleOpenDetail = (id: string) => {
    setSelectedId(id);
    onOpen();
  };

  return (
    <PageContainer>
      <PageTitle>세션 목록</PageTitle>
      <PageContent
        handleSortChange={() => {}}
        headerInfos={formatHeaderInfos(sessionHeader)}
        isLoading={isLoading}
        isMulti={false}
        itemsPerPage={10}
        list={formatList(list)}
        page={page}
        rowId={"ssi_uid"}
        onClickDetail={handleOpenDetail}
        onPageChange={setPage}
      >
        <Search
          handleFilterChange={() => {}}
          label="Search"
          onPageChange={setPage}
        />
      </PageContent>
      {selectedId && detail && (
        <BaseDrawer
          isOpen={isOpen}
          title={detail.title}
          onOpenChange={(open) => {
            onOpenChange();
            if (!open) setSelectedId("");
          }}
        >
          <Suspense fallback={<Spinner />}>{detail.content}</Suspense>
        </BaseDrawer>
      )}
    </PageContainer>
  );
};

export default Session;
