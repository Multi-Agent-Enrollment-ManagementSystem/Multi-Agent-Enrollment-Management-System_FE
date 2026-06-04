import { useCallback, useEffect, useMemo, useState } from "react";
import type { Application } from "@/types/application";
import { loadOfficerDashboardApplications } from "../api/officerDashboardApi";
import {
  buildEscalatedList,
  buildMajorChartData,
  buildStatusChartData,
  computeDashboardStats,
} from "../utils/officerDashboardDerive";
import {
  buildQuickAccessLinks,
  buildQuickStats,
} from "../utils/officerDashboardUiConfig";
import { useOfficerEscalatedColumns } from "./useOfficerEscalatedColumns";

/** Hook tải dữ liệu dashboard và dựng dữ liệu biểu đồ/bảng (không chứa JSX). */
export function useOfficerDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const escalatedColumns = useOfficerEscalatedColumns();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const items = await loadOfficerDashboardApplications();
      setApplications(items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const stats = useMemo(
    () => computeDashboardStats(applications),
    [applications],
  );

  const statusChartData = useMemo(
    () => buildStatusChartData(applications),
    [applications],
  );

  const majorChartData = useMemo(
    () => buildMajorChartData(applications),
    [applications],
  );

  const escalatedList = useMemo(
    () => buildEscalatedList(applications),
    [applications],
  );

  const quickStats = useMemo(() => buildQuickStats(stats), [stats]);

  const quickAccessLinks = useMemo(
    () => buildQuickAccessLinks(stats, loading),
    [stats, loading],
  );

  const updatedAtLabel = new Date().toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    loading,
    refresh: loadData,
    updatedAtLabel,
    quickStats,
    statusChartData,
    majorChartData,
    escalatedList,
    escalatedColumns,
    quickAccessLinks,
  };
}
