import { useRecoilValue } from "recoil";
import { Card, CardBody, useDisclosure } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faClock } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

import { fetchScriptDetailInfoSelector } from "@/recoil/atoms/profile.ts";
import { allDateFormat } from "@/utils/dateFormat.ts";
import { InfoCard } from "@/molecules/DetailCard.tsx";
import { profileDetailHeader } from "@/columnHeaders/profileHeader.tsx";
import { ContentsModal } from "@/pages/profile/modal/ContentsModal.tsx";
import BaseModal from "@/organisms/BaseModal.tsx";

const ProfileDetailContent = ({ id }: { id: string }) => {
  // recoil
  const profileDetail = useRecoilValue(fetchScriptDetailInfoSelector(id));

  // state
  const [contentsModal, setContentsModal] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // modal open
  const openContentsModal = () => {
    setContentsModal(true);
    onOpen();
  };

  const contentsModalConfig = ContentsModal();

  //data
  const profileKeys = [
    "name",
    "description",
    "type",
    "version",
    "contents",
    "ctn_uid",
  ];

  return (
    <div className="flex flex-col gap-3">
      <p className="mdf-time">
        (수정 시간: {allDateFormat(profileDetail[""])})
      </p>
      <Card>
        <CardBody className="timeline-body">
          <div className="timeline">
            <div className="timeline-title">
              <FontAwesomeIcon className="mr-1" icon={faClock} />
              <span>등록일</span>
            </div>
            <p className="time">{allDateFormat(profileDetail["reg_date"])}</p>
          </div>
        </CardBody>
      </Card>
      <InfoCard
        data={profileDetail}
        headers={profileDetailHeader(openContentsModal)}
        icon={faCircleInfo}
        keys={profileKeys}
        title="프로파일 정보"
      />
      {contentsModal && (
        <BaseModal
          config={contentsModalConfig}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </div>
  );
};

export const ProfileDetail = ({ id }: { id: string }) => {
  return {
    title: `프로파일 상세 [${id}]`,
    content: <ProfileDetailContent id={id} />,
  };
};
