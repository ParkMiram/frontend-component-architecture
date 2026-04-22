import { useRecoilRefresher_UNSTABLE, useRecoilValueLoadable } from "recoil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@heroui/react";
import {
  faArrowRotateRight,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useRef, useState } from "react";

import DashboardStatCards from "@/pages/dashboard/DashboardStatCards.tsx";
import DashboardRealtimeIssueStatus from "@/pages/dashboard/DashboardRealtimeIssueStatus.tsx";
import DashboardRecentAlerts from "@/pages/dashboard/DashboardRecentAlerts.tsx";
import {
  realtimeIssueStatusSelector,
  serverInfoSelector,
  todayRateSelector,
} from "@/recoil/atoms/dashboard.ts";

const Dashboard = () => {
  // recoil
  const todayRateLoadable = useRecoilValueLoadable(todayRateSelector);
  const serverInfoLoadable = useRecoilValueLoadable(serverInfoSelector);
  const realtimeIssueStatusLoadable = useRecoilValueLoadable(
    realtimeIssueStatusSelector,
  );

  // recoil - refresh
  const refreshTodayRate = useRecoilRefresher_UNSTABLE(todayRateSelector);
  const refreshServerInfo = useRecoilRefresher_UNSTABLE(serverInfoSelector);
  const refreshRealtimeIssueStatus = useRecoilRefresher_UNSTABLE(
    realtimeIssueStatusSelector,
  );

  // state
  const [refreshTime, setRefreshTime] = useState<string | null>(null);

  const isRefreshing = useMemo(() => {
    return (
      todayRateLoadable.state === "loading" ||
      serverInfoLoadable.state === "loading" ||
      realtimeIssueStatusLoadable.state === "loading"
    );
  }, [
    todayRateLoadable.state,
    serverInfoLoadable.state,
    realtimeIssueStatusLoadable.state,
  ]);

  const isLoading =
    todayRateLoadable.state === "loading" ||
    serverInfoLoadable.state === "loading" ||
    realtimeIssueStatusLoadable.state === "loading";

  // 이전 데이터 유지용 ref
  const prevTodayRateRef = useRef<any>(null);
  const prevServerInfoRef = useRef<any>(null);
  const prevRealtimeIssueStatusRef = useRef<any[]>([]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 최초 로딩
  const hasLoadedOnce =
    prevTodayRateRef.current ||
    prevServerInfoRef.current ||
    prevRealtimeIssueStatusRef.current.length > 0;

  const isInitialLoading = !hasLoadedOnce && isLoading;

  // fn
  // 수동 새로고침
  const handleRefresh = () => {
    refreshTodayRate();
    refreshServerInfo();
    refreshRealtimeIssueStatus();
  };

  // useEffect
  // 갱신 데이터 (오늘의 수율)
  useEffect(() => {
    if (todayRateLoadable.state === "hasValue") {
      prevTodayRateRef.current = todayRateLoadable.contents;
    }
  }, [todayRateLoadable.state, todayRateLoadable.contents]);
  // 갱신 데이터 (정보)
  useEffect(() => {
    if (serverInfoLoadable.state === "hasValue") {
      prevServerInfoRef.current = serverInfoLoadable.contents;
    }
  }, [serverInfoLoadable.state, serverInfoLoadable.contents]);
  // 갱신 데이터 (실시간발급현황)
  useEffect(() => {
    if (realtimeIssueStatusLoadable.state === "hasValue") {
      prevRealtimeIssueStatusRef.current =
        realtimeIssueStatusLoadable.contents?.works ?? [];
    }
  }, [realtimeIssueStatusLoadable.state, realtimeIssueStatusLoadable.contents]);

  // 5초 갱신
  useEffect(() => {
    if (!isLoading) {
      setRefreshTime(new Date().toLocaleString());

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        handleRefresh();
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading]);

  // 최초 1회
  useEffect(() => {
    handleRefresh();
  }, []);

  // data
  const todayRate =
    todayRateLoadable.state === "hasValue"
      ? todayRateLoadable.contents
      : prevTodayRateRef.current;

  const serverInfo =
    serverInfoLoadable.state === "hasValue"
      ? serverInfoLoadable.contents
      : prevServerInfoRef.current;

  const realtimeIssueStatus =
    realtimeIssueStatusLoadable.state === "hasValue"
      ? realtimeIssueStatusLoadable.contents
      : { works: prevRealtimeIssueStatusRef.current };

  return (
    <>
      <div className="dashboard-title">
        <span className="title">대시보드</span>
        <div className="refresh-time">
          <span className="time">
            갱신 시간:{" "}
            {isRefreshing ? (
              <FontAwesomeIcon
                icon={faCircleNotch}
                size="sm"
                spin={isRefreshing}
              />
            ) : (
              refreshTime
            )}
          </span>
          <Button
            color="default"
            isDisabled={isRefreshing}
            radius="md"
            size="sm"
            startContent={
              <FontAwesomeIcon icon={faArrowRotateRight} spin={isRefreshing} />
            }
            onPress={handleRefresh}
          >
            <span className="refresh-text">새로고침</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        {/* 오늘 상태 */}
        <div className="flex gap-3 mt-5">
          <DashboardStatCards
            isInitialLoading={isInitialLoading}
            serverInfo={serverInfo}
            todayRate={todayRate}
          />
        </div>
        {/* 실시간 발급 현황 */}
        <div className="mt-5 flex-1 min-h-0">
          <DashboardRealtimeIssueStatus
            isInitialLoading={isInitialLoading}
            realtimeIssueStatus={realtimeIssueStatus}
          />
        </div>
        <div className="mt-5 flex gap-3 flex-1">
          <DashboardRecentAlerts />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
