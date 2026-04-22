import { useRecoilValue } from "recoil";
import { Card, CardBody } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faClock } from "@fortawesome/free-solid-svg-icons";

import { fetchMachineDetailInfoSelector } from "@/recoil/atoms/machine.ts";
import { machineDetailHeader } from "@/columnHeaders/machineHeader.tsx";
import { allDateFormat } from "@/utils/dateFormat.ts";
import { InfoCard } from "@/molecules/DetailCard.tsx";

const DeviceDetailContent = ({ id }: { id: string }) => {
  // recoil
  const machineDetail = useRecoilValue(fetchMachineDetailInfoSelector(id));

  // data
  // 발급장비 정보
  const machineInfoKeys = ["name", "etc", "mcn_uid"];

  if (!machineDetail) return null;

  return (
    <div className="flex flex-col gap-3">
      <p className="mdf-time">
        (수정 시간: {allDateFormat(machineDetail[""])})
      </p>
      <Card>
        <CardBody className="timeline-body">
          <div className="timeline">
            <div className="timeline-title">
              <FontAwesomeIcon className="mr-1" icon={faClock} />
              <span>등록일</span>
            </div>
            <p className="time">{allDateFormat(machineDetail["reg_date"])}</p>
          </div>
        </CardBody>
      </Card>
      <InfoCard
        data={machineDetail}
        headers={machineDetailHeader}
        icon={faCircleInfo}
        keys={machineInfoKeys}
        title="발급장비 정보"
      />
    </div>
  );
};

export const MachineDetail = ({ id }: { id: string }) => {
  return {
    title: `발급장비 상세 [${id}]`,
    content: <DeviceDetailContent id={id} />,
  };
};
