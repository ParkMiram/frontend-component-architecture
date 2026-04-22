import { Card, CardBody, CardHeader, Divider, Spinner } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faCalendarDay,
  faCircleInfo,
  faServer,
} from "@fortawesome/free-solid-svg-icons";

import "../../styles/dashboard.scss";

const DashboardStatCards = ({
  todayRate,
  serverInfo,
  isInitialLoading,
}: {
  todayRate: any;
  serverInfo: any;
  isInitialLoading: boolean;
}) => {
  // state
  // 정보
  const serverInfoData = serverInfo?.server_info;
  // 서버 상태
  const resourceUsageData = serverInfo?.resource_usage;

  return (
    <>
      <Card className="w-1/3">
        <CardHeader className="card-header bg-blue-900">
          <FontAwesomeIcon className="text-white" icon={faCalendarDay} />
          <p className="title text-white">오늘의 수율</p>
          <p className="today">({todayRate?.date})</p>
        </CardHeader>
        <Divider />
        <CardBody className="today-rate-body h-[124px]">
          {isInitialLoading ? (
            <Spinner />
          ) : (
            <>
              <p className="text-7xl today-rate">
                {todayRate?.yield_rate ?? 0}%
                {!(todayRate?.yield_rate === null || 0 || undefined) && (
                  <FontAwesomeIcon
                    className={
                      todayRate?.yield_rate > 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                    icon={todayRate?.yield_rate > 0 ? faArrowUp : faArrowDown}
                    size="2xs"
                  />
                )}
              </p>
              <div className="today-count">
                <span className="today-count-info">
                  * (실패 수량 / 성공 수량)
                </span>
                <span className="today-count-value text-3xl">
                  ({todayRate?.real_fail_count} /{" "}
                  <b>{todayRate?.success_count}</b>)
                </span>
              </div>
            </>
          )}
        </CardBody>
      </Card>
      <Card className="w-1/3">
        <CardHeader className="card-header bg-slate-100">
          <FontAwesomeIcon className="text-blue-800" icon={faCircleInfo} />
          <p className="title">정보</p>
        </CardHeader>
        <Divider className="bg-slate-200" />
        <CardBody className="card-body h-[124px]">
          {isInitialLoading ? (
            <Spinner />
          ) : (
            <>
              <div className="cell">
                <span className="bar" />
                <p className="cell-header">TITLE</p>
                <p>{serverInfoData?.title}</p>
              </div>
              <div className="cell">
                <span className="bar" />
                <p className="cell-header">VERSION</p>
                <p>{serverInfoData?.version}</p>
              </div>
              <div className="cell">
                <span className="bar" />
                <p className="cell-header">DB HOST</p>
                <p>{serverInfoData?.db_host}</p>
              </div>
              <div className="cell">
                <span className="bar" />
                <p className="cell-header">DB NAME</p>
                <p>{serverInfoData?.db_name}</p>
              </div>
            </>
          )}
        </CardBody>
      </Card>
      <Card className="w-1/3">
        <CardHeader className="card-header bg-slate-100">
          <FontAwesomeIcon className="text-green-800" icon={faServer} />
          <p className="title">서버 상태</p>
        </CardHeader>
        <Divider className="bg-slate-200" />
        <CardBody className="card-body h-[124px]">
          {isInitialLoading ? (
            <Spinner />
          ) : (
            <>
              <div className="cell">
                <p className="cell-header">CPU</p>
                <p>{resourceUsageData?.cpu_percent}%</p>
              </div>
              <div className="cell">
                <p className="cell-header">MEMORY</p>
                <p>{resourceUsageData?.memory_percent}%</p>
                <p className="text-gray-400 ml-3">
                  ({resourceUsageData?.memory_used_gb}GB /{" "}
                  {resourceUsageData?.memory_total_gb}GB)
                </p>
              </div>
              <div className="cell">
                <p className="cell-header">DISK</p>
                <p>{resourceUsageData?.disk_percent}%</p>
                <p className="text-gray-400 ml-3">
                  ({resourceUsageData?.disk_used_gb}GB /{" "}
                  {resourceUsageData?.disk_total_gb}GB)
                </p>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default DashboardStatCards;
