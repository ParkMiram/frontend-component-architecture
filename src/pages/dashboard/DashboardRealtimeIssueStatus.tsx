import {
  Card,
  CardBody,
  CardHeader,
  Progress,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import "../../styles/dashboard.scss";

import { realtimeHeader } from "@/columnHeaders/realtimeHeader.ts";
import { WorkStatusChip } from "@/atoms/Chips.tsx";

interface RealtimeIssueStatus {
  works: any[];
}

const DashboardRealtimeIssueStatus = ({
  realtimeIssueStatus,
  isInitialLoading,
}: {
  realtimeIssueStatus: RealtimeIssueStatus;
  isInitialLoading: boolean;
}) => {
  const data = realtimeIssueStatus?.works ?? [];

  return (
    <>
      <Card className="w-full h-full">
        <CardHeader className="card-header">
          <FontAwesomeIcon icon={faSpinner} />
          <span className="title ">실시간 발급 현황</span>
        </CardHeader>
        <CardBody className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <Table
            isHeaderSticky
            removeWrapper
            aria-label="실시간 발급 현황 테이블"
            classNames={{
              base: "flex-1 min-h-0 overflow-auto",
              td: "border-b border-slate-200 border-r last:border-r-0 border-t",
              th: "border-r border-slate-200 last:border-r-0",
            }}
          >
            <TableHeader>
              {realtimeHeader
                .filter((header) => header.isDisplay)
                .map((header) => (
                  <TableColumn
                    key={header.keyName}
                    style={{ minWidth: header?.minWidth }}
                  >
                    {header.name}
                  </TableColumn>
                ))}
            </TableHeader>
            <TableBody
              emptyContent={"No rows to display."}
              isLoading={isInitialLoading}
              items={data ?? []}
              loadingContent={<Spinner />}
            >
              {(item) => (
                <TableRow key={item["work_id"]}>
                  {(columnKey) => {
                    const value = item[columnKey];

                    if (columnKey === "progress_percent") {
                      return (
                        <TableCell>
                          <div className="flex items-center">
                            <Progress
                              className="flex-1"
                              color={
                                item.status === "Active"
                                  ? "primary"
                                  : item.status === "Paused"
                                    ? "warning"
                                    : "danger"
                              }
                              maxValue={100}
                              size="md"
                              value={Number(value)}
                            />
                            <span className="text-xs w-10 text-right">
                              {value}%
                            </span>
                          </div>
                        </TableCell>
                      );
                    } else if (columnKey === "status") {
                      return (
                        <TableCell>
                          <WorkStatusChip value={value} />
                        </TableCell>
                      );
                    }

                    return <TableCell>{value}</TableCell>;
                  }}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
};

export default DashboardRealtimeIssueStatus;
