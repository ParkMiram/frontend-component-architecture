import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import {
  addToast,
  Button,
  Card,
  CardBody,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line import/order
import {
  faCircleInfo,
  faCirclePlus,
  faClock,
  faFileCode,
  faMicrochip,
  faPen,
  faSquareBinary,
  faStopwatch,
  faTag,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/detail.scss";

import { faExpeditedssl } from "@fortawesome/free-brands-svg-icons";

import {
  fetchWorkDetailInfoSelector,
  useUpdateWorkStatus,
  workStatusIsRunning,
} from "@/recoil/atoms/work";
import { NewTabIcon } from "@/assets/icons/NewTabIcon.tsx";
import BaseModal from "@/organisms/BaseModal.tsx";
import { WorkModifyModal } from "@/pages/work/modal/WorkModifyModal.tsx";
import { allDateFormat } from "@/utils/dateFormat.ts";
import { workDetailHeader } from "@/columnHeaders/workHeader.tsx";
import { InfoCard, TableCard } from "@/molecules/DetailCard.tsx";

const WorkDetailContent = ({
  id,
  onMovePgm,
}: {
  id: string;
  onMovePgm: (pgmId: string) => void;
}) => {
  // recoil
  const workDetail = useRecoilValue(fetchWorkDetailInfoSelector(id));

  // data
  // 작업 정보
  const workInfoKeys = ["tag_name", "device_name", "mcn_name", "status"];
  // 고객 정보
  const customerInfoKeys = ["customer", "order_no"];
  // 식별자 정보
  const uidInfoKeys = ["wki_uid", "pji_uid", "mcn_uid"];
  // 발급 수량
  const issueKeys = [
    "target_size",
    "completed_size",
    "success_ok",
    "total_fail",
    "real_fail",
    "yield_rate",
    "failed_size",
  ];
  // 상세 정보
  const detailKeys = ["param_ext", "description", "detail_status"];
  // 프로그램 정보
  const pgmKeys = [
    "prj_title",
    "prj_description",
    "session_handler",
    "prj_status",
    "product",
    "etc_option",
  ];
  // 암호화/잠금 여부
  const lockKeys = ["is_encrypted_sn", "is_lock"];

  if (!workDetail) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="mdf-time">(수정 시간: {allDateFormat(workDetail[""])})</p>
      <Card>
        <CardBody className="timeline-body">
          <div className="timeline">
            <div className="timeline-title">
              <FontAwesomeIcon className="mr-1" icon={faClock} />
              <span>작업 시작 시간</span>
            </div>
            <p className="time">
              {allDateFormat(workDetail["work_start_time"])}
            </p>
          </div>
          <div className="timeline">
            <div className="timeline-title">
              <FontAwesomeIcon className="mr-1" icon={faStopwatch} />
              <span>마감 기한</span>
            </div>
            <p className="time">{allDateFormat(workDetail["due_date"])}</p>
          </div>
        </CardBody>
      </Card>
      <InfoCard
        data={workDetail}
        headers={workDetailHeader}
        icon={faCircleInfo}
        keys={workInfoKeys}
        title="작업 정보"
      />
      <InfoCard
        data={workDetail}
        headers={workDetailHeader}
        icon={faUserTie}
        keys={customerInfoKeys}
        title="고객 정보"
      />
      <div className="flex gap-3">
        <InfoCard
          data={workDetail}
          headers={workDetailHeader}
          icon={faTag}
          keys={uidInfoKeys}
          title="식별자 정보"
          width="w-1/2"
        />
        <InfoCard
          data={workDetail}
          headers={workDetailHeader}
          icon={faExpeditedssl}
          keys={lockKeys}
          title="암호화/잠금 여부"
          width="w-1/2"
        />
      </div>
      <TableCard
        data={workDetail}
        headers={workDetailHeader}
        icon={faMicrochip}
        keys={issueKeys}
        title="발급 수량"
      />
      <InfoCard
        data={workDetail}
        headers={workDetailHeader}
        icon={faCirclePlus}
        keys={detailKeys}
        title="상세 정보"
      />
      <InfoCard
        data={workDetail}
        headers={workDetailHeader}
        icon={faSquareBinary}
        keys={pgmKeys}
        title="프로젝트 정보"
      >
        <Button
          color="primary"
          size="sm"
          variant="shadow"
          onPress={() => {
            onMovePgm(workDetail["pji_uid"]);
          }}
        >
          PGM 정보 →
        </Button>
      </InfoCard>
      <InfoCard
        data={workDetail}
        headers={workDetailHeader}
        icon={faFileCode}
        keys={[]}
        title="프로파일 정보"
      />
    </div>
  );
};

const WorkModifyButton = ({ id }: { id: string }) => {
  // recoil
  const workStatus = useRecoilValueLoadable(workStatusIsRunning(id));

  // state
  const [mdfModal, setMdfModal] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  // var
  const canModifyWork = !(workStatus.contents === "RUNNING");

  // modal open
  const openModifyModal = () => {
    setMdfModal(true);
    onOpen();
  };

  // modal success
  const handleModalSuccess = () => {
    onClose();
  };

  // modal config
  const modifyModalConfig = WorkModifyModal({
    id: id,
    success: handleModalSuccess,
  });

  // return
  if (workStatus.state !== "hasValue") return null;

  return (
    <>
      {canModifyWork && (
        <Button
          className="min-w-10 max-w-10"
          color="default"
          variant="flat"
          onPress={openModifyModal}
        >
          <FontAwesomeIcon icon={faPen} size="lg" />
        </Button>
      )}
      {mdfModal && (
        <BaseModal
          config={modifyModalConfig}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
        />
      )}
    </>
  );
};

const WorkStatusButton = ({ id }: { id: string }) => {
  // recoil
  const workStatus = useRecoilValueLoadable(workStatusIsRunning(id));
  const updateStatus = useUpdateWorkStatus();

  // state
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  // return
  if (workStatus.state !== "hasValue") return null;

  // var
  const canFinishWork = !(
    workStatus.contents === "RUNNING" || workStatus.contents === "FINISHED"
  );
  const canRestartWork = !(workStatus.contents === "RUNNING");

  // fn
  const handleClick = async () => {
    try {
      await updateStatus(id);
      addToast({
        title: "작업이 종료되었습니다.",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      addToast({
        title: "작업을 종료하지 못했습니다.",
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
      console.log("실패: ", error);
    } finally {
      setIsOpenPopover(false);
    }
  };

  return (
    <>
      {canRestartWork && (
        <Button
          as="a"
          color="primary"
          endContent={<NewTabIcon />}
          href={`http://192.168.1.17:7777/work_status.do?uid=${id}&option=work_status`}
          rel="noopenner noreferrer"
          target="_blank"
        >
          발급모드 이동
        </Button>
      )}
      {canFinishWork && (
        <Popover
          showArrow
          backdrop={"opaque"}
          isOpen={isOpenPopover}
          offset={15}
          placement="top"
          onOpenChange={setIsOpenPopover}
        >
          <PopoverTrigger>
            <Button color="warning" onPress={() => setIsOpenPopover(true)}>
              작업 종료
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-base font-medium m-2">
              작업을 종료하시겠습니까?
            </p>
            <div className="flex items-center space-x-2 mb-3">
              <Button
                color="warning"
                radius="md"
                size="sm"
                onPress={handleClick}
              >
                종료
              </Button>
              <Button
                color="default"
                radius="md"
                size="sm"
                variant="light"
                onPress={() => setIsOpenPopover(false)}
              >
                취소
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </>
  );
};

export const WorkDetail = ({
  id,
  onMovePgm,
}: {
  id: string;
  onMovePgm: (pgmId: string) => void;
}) => {
  return {
    title: `작업 상세 [${id}]`,
    content: <WorkDetailContent id={id} onMovePgm={onMovePgm} />,
    leftButton: <WorkModifyButton id={id} />,
    button: <WorkStatusButton id={id} />,
  };
};
