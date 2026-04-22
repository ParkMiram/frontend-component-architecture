import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePollHorizontal } from "@fortawesome/free-solid-svg-icons";

const DashboardRecentAlerts = () => {
  return (
    <>
      <Card className="w-full min-h-[200px]">
        <CardHeader className="card-header bg-slate-200">
          <FontAwesomeIcon
            className="text-stone-800"
            icon={faSquarePollHorizontal}
          />
          <span className="title">최근 알림/에러</span>
        </CardHeader>
        <Divider />
        <CardBody>
          <p>
            2025-10-28 오후 4:28 | 251103-05 이윤상_수석(실장테스트용) mtr uson8
            10 11/03_02 작업 시작
          </p>
        </CardBody>
      </Card>
    </>
  );
};

export default DashboardRecentAlerts;
