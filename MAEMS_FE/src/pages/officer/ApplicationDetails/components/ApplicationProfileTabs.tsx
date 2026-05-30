import { Card, Descriptions, Space, Tabs, Tag, Typography } from "antd";
import { ChevronRight, TriangleAlert } from "lucide-react";
import type { Application } from "../../../../types/application";
import type { Score } from "../../../../types/score";
import { APPLICATION_REQUIRES_REVIEW_LABEL } from "../../../../types/application";
import { ensureUtc } from "../../../../utils/date";
import {
  APPLICATION_LEVEL_TAG_COLOR,
  formatApplicationLevel,
} from "../utils/applicationLevelDisplay";
import type { ApplicationLevel } from "../../../../types/enums";
import { STATUS_CFG } from "../types";
import { initialsFromName } from "../utils/displayHelpers";
import { ApplicantScoresTab } from "./ApplicantScoresTab";

const { Text } = Typography;

type ApplicationProfileTabsProps = {
  app: Application;
  profileTabKey: string;
  onProfileTabChange: (key: string) => void;
  onOpenApplicantProfile: () => void;
  applicantScore: Score | null;
  scoresLoading: boolean;
  onRefreshScores: () => void;
};

/** Tab thông tin hồ sơ và điểm thí sinh — kèm tag trạng thái trên tab bar */
export function ApplicationProfileTabs({
  app,
  profileTabKey,
  onProfileTabChange,
  onOpenApplicantProfile,
  applicantScore,
  scoresLoading,
  onRefreshScores,
}: ApplicationProfileTabsProps) {
  return (
    <Card
      className="!mt-0 rounded-2xl border border-gray-100 shadow-sm"
      styles={{ body: { padding: "20px 24px" } }}
    >
      <Tabs
        activeKey={profileTabKey}
        onChange={onProfileTabChange}
        destroyOnHidden
        tabBarExtraContent={
          <Space wrap size={[8, 8]} className="max-sm:justify-end">
            <Tag
              color={STATUS_CFG[app.status].color}
              className="text-sm px-3 py-0.5 !m-0"
            >
              {STATUS_CFG[app.status].label}
            </Tag>
            {app.requiresReview && (
              <Tag
                color="red"
                className="text-xs !inline-flex !items-center gap-1 !m-0"
              >
                <TriangleAlert className="size-3.5 shrink-0" aria-hidden />
                {APPLICATION_REQUIRES_REVIEW_LABEL}
              </Tag>
            )}
          </Space>
        }
        className={[
          "officer-profile-tabs",
          "[&_.ant-tabs-nav]:!mb-0",
          "[&_.ant-tabs-nav-wrap]:!flex-nowrap",
          "[&_.ant-tabs-content-holder]:!min-h-0",
          "[&_.ant-tabs-content]:!h-auto",
          "[&_.ant-tabs-tabpane]:!p-0",
          "[&_.ant-tabs-tabpane-hidden]:!hidden",
          "[&_.ant-tabs-tabpane-active]:!block",
        ].join(" ")}
        items={[
          {
            key: "profile",
            label: "Thông tin hồ sơ",
            children: (
              <div className="flex flex-col gap-4 pt-1">
                <button
                  type="button"
                  onClick={onOpenApplicantProfile}
                  className="w-full text-left rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-white px-4 py-3.5 transition-all hover:border-indigo-200 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold text-sm">
                      {initialsFromName(app.applicantName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Text className="!mb-0 font-semibold text-gray-900 text-base">
                          {app.applicantName}
                        </Text>
                        <Tag color="geekblue" className="!m-0 !text-xs">
                          Hồ sơ thí sinh
                        </Tag>
                      </div>
                      <Text className="text-xs text-gray-500 block mt-0.5">
                        Mã thí sinh{" "}
                        <span className="font-mono text-indigo-600">
                          #{app.applicantId}
                        </span>
                        {" · "}
                        Nhấn để xem chi tiết cá nhân
                      </Text>
                    </div>
                    <ChevronRight
                      size={20}
                      className="text-indigo-400 shrink-0"
                      aria-hidden
                    />
                  </div>
                </button>

                <Descriptions
                  column={{ xs: 1, sm: 2 }}
                  size="small"
                  className="!mb-0 [&_.ant-descriptions-view]:!mb-0 [&_.ant-descriptions-row:last-child_td]:!pb-0 [&_.ant-descriptions-row:last-child_th]:!pb-0"
                >
                  <Descriptions.Item label="Mã hồ sơ">
                    <Text className="font-mono text-indigo-600 font-semibold">
                      {app.applicationId}
                    </Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngành đăng ký">
                    {app.programName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phương thức XT">
                    {app.admissionTypeName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cơ sở">
                    {app.campusName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Năm tuyển sinh">
                    {app.enrollmentYear}
                  </Descriptions.Item>
                  <Descriptions.Item label="Xếp hạng">
                    {app.level ? (
                      <Tag
                        color={
                          APPLICATION_LEVEL_TAG_COLOR[
                            app.level as NonNullable<ApplicationLevel>
                          ]
                        }
                        className="!m-0"
                      >
                        {formatApplicationLevel(app.level)}
                      </Tag>
                    ) : (
                      <Text className="text-gray-300">—</Text>
                    )}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày nộp">
                    {app.submittedAt
                      ? new Date(ensureUtc(app.submittedAt)).toLocaleString(
                          "vi-VN",
                        )
                      : "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cập nhật lần cuối">
                    {app.lastUpdated
                      ? new Date(ensureUtc(app.lastUpdated)).toLocaleString(
                          "vi-VN",
                        )
                      : "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Cán bộ phụ trách">
                    {app.assignedOfficerName ?? (
                      <Text className="text-gray-300">Chưa phân công</Text>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ),
          },
          {
            key: "scores",
            label: "Điểm thí sinh",
            children: (
              <ApplicantScoresTab
                score={applicantScore}
                loading={scoresLoading}
                onRefresh={onRefreshScores}
              />
            ),
          },
        ]}
      />
    </Card>
  );
}
