import { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRotateRight,
  faShieldHalved,
  faSquarePen,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";

import StyledSelect from "../../../atoms/StyledSelect";

import UserPolicy from "./UserPolicy";
import UserGroup from "./UserGroup";
import { UserRemoveModal } from "./modal/UserRemoveModal";
import { UserInfoEditModal } from "./modal/UserInfoEditModal";
import { UserChangeStatusModal } from "./modal/UserChangeStatusModal";
import { UserChangeMfaModal } from "./modal/UserChangeMfaModal";
import { UserPasswordResetModal } from "./modal/UserPasswordResetModal";

import { fetchUserInfo, userInfoAtom } from "@/recoil/atoms/user.ts";
import { FetchUserInfoParams } from "@/types/type/PageType.ts";
import { useFetchList } from "@/hooks/fetchListData.ts";
import { PageContainer } from "@/template/PageContainer.tsx";
import { PageTitle } from "@/molecules/Title.tsx";
import { SinglePageContent } from "@/template/PageContent.tsx";
import { Button, PageButton, PageButtonBox } from "@/atoms/Button.tsx";
import { TabContainer } from "@/molecules/TabContainer.tsx";
import { Refreshable } from "@/types/type/refresh.ts";
import { useParamsRefetch } from "@/hooks/useParamRefetch.ts";

const OldUserDetail = () => {
  // var
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const account = JSON.parse(localStorage.getItem("recoil-persist") as string)
    ?.authAtom.userInfo.userId;
  // recoil
  const setUserInfo = useSetRecoilState(userInfoAtom);
  const { loading } = useRecoilValue(userInfoAtom);
  // state
  const [headerInfos, setHeaderInfos] = useState([]);
  const [list, setList] = useState<any[]>([]);
  // select
  const statusItems = [
    {
      label: list[0]?.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
      value: list[0]?.status === "ACTIVE" ? "inactive" : "active",
    },
  ];
  const [status, setStatus] = useState({ label: "상태 변경", value: "" });
  // tab
  const tabs = [
    { label: "권한", value: "policy" },
    { label: "사용자 그룹", value: "userGroup" },
  ];
  const [selectedTab, setSelectedTab] = useState<string>(tabs[0].value);
  // modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 정보 변경
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false); // 삭제
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false); // 상태 변경

  console.log(isStatusModalOpen);
  const [isMfaModalOpen, setIsMfaModalOpen] = useState(false); // 2차 인증 변경
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] =
    useState(false); // 비밀번호 초기화
  // init
  const [params, setParams] = useState<Refreshable<FetchUserInfoParams>>({
    isHeaderInfo: true,
    userId: userId as string,
  });
  // refetch
  const refetchList = useParamsRefetch(setParams);

  // fn
  // fetch
  useFetchList(params, {
    setState: setUserInfo,
    fetchList: fetchUserInfo,
    setHeaderInfos,
    setList,
  });

  // format - header
  const formatHeaderInfos = (headerInfos: any[]) => {
    return headerInfos?.map((item) => ({
      ...item,
      minWidth:
        item.keyName === "regDate" ||
        item.keyName === "updateDate" ||
        item.keyName === "userId" ||
        item.keyName === "object" ||
        item.keyName === "email"
          ? 160
          : item.keyName === "period"
            ? 190
            : undefined,
    }));
  };

  // status BaseModal 확인/취소
  const deferredRef = useRef<{ resolve: (ok: boolean) => void } | null>(null);
  // StyledSelect
  const confirmChange = () => {
    setIsStatusModalOpen(true);

    return new Promise<boolean>((resolve) => {
      deferredRef.current = { resolve };
    });
  };

  // renderCell
  // const handleCellFeatures = (targetField: string) => {
  //   return (params: GridRenderCellParams) => {
  //     const value = params.row[targetField] as string;
  //
  //     if ("status" === targetField) {
  //       return <UserStatusBadge status={value} />;
  //     } else return value;
  //   };
  // };

  // modal 성공 시
  const handleModalSuccess = () => {
    setIsEditModalOpen(false);
    setIsStatusModalOpen(false);
    setIsMfaModalOpen(false);
    setIsPasswordResetModalOpen(false);
    refetchList();
  };
  // modal 성공 시 (삭제)
  const handleRemoveModalSuccess = () => {
    setIsRemoveModalOpen(false);
    navigate("/user/list");
  };
  // modal config
  const editModalConfig = UserInfoEditModal(
    handleModalSuccess,
    list[0],
    setIsEditModalOpen,
  ); // 정보 변경
  const removeModalConfig = UserRemoveModal(handleRemoveModalSuccess, list[0]); // 삭제
  const statusModalConfig = UserChangeStatusModal(
    handleModalSuccess,
    list[0],
    setIsStatusModalOpen,
  ); // 상태 변경
  const mfaModalConfig = UserChangeMfaModal(
    handleModalSuccess,
    list[0],
    setIsMfaModalOpen,
  ); // 2차 인증 변경
  const passwordResetModalConfig = UserPasswordResetModal(
    handleModalSuccess,
    list[0],
    setIsPasswordResetModalOpen,
  ); // 비밀번호 초기화

  console.log(
    editModalConfig,
    removeModalConfig,
    statusModalConfig,
    mfaModalConfig,
    passwordResetModalConfig,
  );

  return (
    <PageContainer>
      <div className="detail-header">
        <Button className="back-button">
          <Link to={"/user/list"}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </Link>
        </Button>
        <PageTitle>{userId}</PageTitle>
      </div>
      <SinglePageContent
        checkbox={false}
        // handleCellFeatures={handleCellFeatures}
        headerInfos={formatHeaderInfos(headerInfos)}
        isLoading={loading}
        itemsPerPage={1}
        list={list}
        rowId={"userId"}
      >
        <div className="info-header">
          <PageTitle>사용자 정보</PageTitle>
          <PageButtonBox>
            <StyledSelect
              className="page-button status"
              confirmChange={confirmChange}
              disabled={account === userId}
              placeholder="상태 변경"
              selectItems={statusItems}
              setSelectValue={setStatus}
              value={status}
            />
            <PageButton
              disabled={account === userId}
              icon={faSquarePen}
              onClick={() => setIsEditModalOpen(!isEditModalOpen)}
            >
              정보 변경
            </PageButton>
            <PageButton
              disabled={account === userId}
              icon={faShieldHalved}
              onClick={() => setIsMfaModalOpen(!isMfaModalOpen)}
            >
              2차 인증 변경
            </PageButton>
            <PageButton
              disabled={account === userId}
              icon={faArrowRotateRight}
              onClick={() =>
                setIsPasswordResetModalOpen(!isPasswordResetModalOpen)
              }
            >
              비밀번호 초기화
            </PageButton>
            <PageButton
              disabled={account === userId}
              icon={faSquareXmark}
              onClick={() => setIsRemoveModalOpen(!isRemoveModalOpen)}
            >
              사용자 삭제
            </PageButton>
          </PageButtonBox>
        </div>
      </SinglePageContent>
      <TabContainer
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        tabs={tabs}
      >
        {selectedTab === "policy" && <UserPolicy userId={userId} />}
        {selectedTab === "userGroup" && <UserGroup userId={userId} />}
      </TabContainer>
      {/*{isEditModalOpen && (*/}
      {/*  <Modal config={editModalConfig} onClose={setIsEditModalOpen} />*/}
      {/*)}*/}
      {/*{isRemoveModalOpen && (*/}
      {/*  <Modal config={removeModalConfig} onClose={setIsRemoveModalOpen} />*/}
      {/*)}*/}
      {/*{isStatusModalOpen && (*/}
      {/*  <Modal config={statusModalConfig} onClose={setIsStatusModalOpen} />*/}
      {/*)}*/}
      {/*{isMfaModalOpen && (*/}
      {/*  <Modal config={mfaModalConfig} onClose={setIsMfaModalOpen} />*/}
      {/*)}*/}
      {/*{isPasswordResetModalOpen && (*/}
      {/*  <Modal*/}
      {/*    config={passwordResetModalConfig}*/}
      {/*    onClose={setIsPasswordResetModalOpen}*/}
      {/*  />*/}
      {/*)}*/}
    </PageContainer>
  );
};

export default OldUserDetail;
