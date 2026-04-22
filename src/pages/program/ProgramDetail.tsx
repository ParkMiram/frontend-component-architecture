import {
  addToast,
  Button,
  Card,
  CardBody,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { useState } from "react";
import {
  faCircleInfo,
  faCirclePlus,
  faClock,
  faCode,
  faImagePortrait,
  faLaptopCode,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  fetchProgramDetailInfoSelector,
  programStatusIsActive,
} from "@/recoil/atoms/program.ts";
import { allDateFormat } from "@/utils/dateFormat.ts";
import { InfoCard } from "@/molecules/DetailCard.tsx";
import { programDetailHeader } from "@/columnHeaders/programHeader.tsx";

const ProgramDetailContent = ({ id }: { id: string }) => {
  // recoil
  const programDetail = useRecoilValue(fetchProgramDetailInfoSelector(id));

  // data
  // 프로그램 정보
  const pgmInfoKeys = [
    "pji_uid",
    "name",
    "product",
    "status",
    "session_handler",
  ];
  // 파라미터 정보
  const paramInfoKeys = ["param", "param_ext"];
  // 테스트 코드 정보
  const testCodeInfoKeys = [
    "test_code",
    "extra_test_code_name",
    "extra_test_code_ctn_uid",
  ];
  // 프로필 정보
  const profileInfoKeys = ["profile_name", "profile_ctn_uid"];
  // 타입 정보
  const typeInfoKeys = ["interface_type", "package_type"];
  // 상세 정보
  const detailInfoKeys = ["description", "etc_option", "is_encrypted_sn"];

  if (!programDetail) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="mdf-time">
        (수정 시간: {allDateFormat(programDetail[""])})
      </p>
      <Card>
        <CardBody className="timeline-body">
          <div className="timeline">
            <div className="timeline-title">
              <FontAwesomeIcon className="mr-1" icon={faClock} />
              <span>등록일</span>
            </div>
            <p className="time">{allDateFormat(programDetail["reg_date"])}</p>
          </div>
        </CardBody>
      </Card>
      <InfoCard
        data={programDetail}
        headers={programDetailHeader}
        icon={faCircleInfo}
        keys={pgmInfoKeys}
        title="프로젝트 정보"
      />
      <InfoCard
        data={programDetail}
        headers={programDetailHeader}
        icon={faCode}
        keys={paramInfoKeys}
        title="파라미터 정보"
      />
      <InfoCard
        data={programDetail}
        headers={programDetailHeader}
        icon={faTag}
        keys={typeInfoKeys}
        title="타입 정보"
      />
      <InfoCard
        data={programDetail}
        headers={programDetailHeader}
        icon={faLaptopCode}
        keys={testCodeInfoKeys}
        title="테스트 코드 정보"
      />
      <InfoCard
        data={programDetail}
        headers={programDetailHeader}
        icon={faImagePortrait}
        keys={profileInfoKeys}
        title="프로필 정보"
      />
      <InfoCard
        data={programDetail}
        headers={programDetailHeader}
        icon={faCirclePlus}
        keys={detailInfoKeys}
        title="상세 정보"
      />
    </div>
  );
};

const ProgramStatusButton = ({ id }: { id: string }) => {
  // recoil
  const programIsActive = useRecoilValueLoadable(programStatusIsActive(id));

  // state
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  // fn
  const handleClick = async () => {
    try {
      addToast({
        title: "아직 API 구현이 안 되어 있습니다.",
        color: "success",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } catch (error) {
      addToast({
        title: "아직 API 구현이 안 되어 있습니다.",
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgress: true,
      });
    } finally {
      setIsOpenPopover(false);
    }
  };

  return (
    <>
      {programIsActive && (
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
              비활성화
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-base font-medium m-2">
              해당 프로그램을 비활성화 하시겠습니까?
            </p>
            <div className="flex items-center space-x-2 mb-3">
              <Button
                color="warning"
                radius="md"
                size="sm"
                onPress={handleClick}
              >
                비활성화
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

export const ProgramDetail = ({
  id,
  onBack,
}: {
  id: string;
  onBack?: () => void;
}) => {
  return {
    title: `프로그램 상세 [${id}]`,
    content: <ProgramDetailContent id={id} />,
    leftButton: onBack && (
      <Button variant="light" onPress={onBack}>
        ← 작업 정보
      </Button>
    ),
    button: <ProgramStatusButton id={id} />,
  };
};
