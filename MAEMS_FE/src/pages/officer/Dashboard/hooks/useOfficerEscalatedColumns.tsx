import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Eye } from "lucide-react";
import type { Application } from "@/types/application";
import {
  APPLICATION_REQUIRES_REVIEW_LABEL,
  APPLICATION_STATUS,
} from "@/types/application";
import { TABLE_NOTE_ELLIPSIS } from "../utils/officerDashboardConstants";
import { parseAgentNote } from "../utils/officerDashboardAgentNote";

const { Text, Paragraph } = Typography;

/** Cột bảng hồ sơ cần xử lý trên dashboard. */
export function useOfficerEscalatedColumns() {
  const navigate = useNavigate();

  return useMemo<ColumnsType<Application>>(
    () => [
      {
        title: "Mã đơn",
        dataIndex: "applicationId",
        key: "id",
        width: 80,
        render: (id: number) => (
          <Text className="font-mono text-xs text-indigo-600 font-semibold">
            #{id}
          </Text>
        ),
      },
      {
        title: "Tên thí sinh",
        dataIndex: "applicantName",
        key: "name",
        width: 168,
        ellipsis: { showTitle: true },
        render: (name: string) => (
          <Text className="font-medium text-gray-800 whitespace-nowrap">
            {name}
          </Text>
        ),
      },
      {
        title: "Ngành đăng ký",
        dataIndex: "programName",
        key: "major",
        width: 200,
        ellipsis: { showTitle: true },
        render: (prog: string) => (
          <Text className="text-gray-600 text-sm">{prog}</Text>
        ),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: 130,
        render: (status: string, record: Application) => {
          if (status === "under_review")
            return (
              <Tag color="processing">{APPLICATION_STATUS.under_review}</Tag>
            );
          if (record.requiresReview)
            return (
              <Tag color="error">{APPLICATION_REQUIRES_REVIEW_LABEL}</Tag>
            );
          return <Tag color="processing">Đang chờ</Tag>;
        },
      },
      {
        title: "Lý do / Ghi chú agent",
        dataIndex: "notes",
        key: "reason",
        render: (notes: string | null, record: Application) => {
          const { missingDocs } = parseAgentNote(notes);
          if (missingDocs.length > 0) {
            return (
              <div>
                <Text className="text-amber-600 text-xs block mb-1">
                  Thiếu tài liệu:
                </Text>
                <div className="flex flex-wrap gap-1">
                  {missingDocs.map((d) => (
                    <Tag
                      key={d}
                      color="orange"
                      className="!text-[10px] !m-0 !px-1"
                    >
                      {d.replace(/_/g, " ")}
                    </Tag>
                  ))}
                </div>
              </div>
            );
          }
          if (notes)
            return (
              <Paragraph
                className="!mb-0 !text-xs !text-gray-500"
                ellipsis={TABLE_NOTE_ELLIPSIS}
              >
                {notes}
              </Paragraph>
            );
          return (
            <Text className="text-gray-300 text-xs">
              {record.requiresReview
                ? APPLICATION_REQUIRES_REVIEW_LABEL
                : "Chờ xử lý"}
            </Text>
          );
        },
      },
      {
        title: "",
        key: "action",
        width: 70,
        render: (_: unknown, record: Application) => (
          <Button
            size="small"
            icon={<Eye size={13} />}
            type="link"
            onClick={() =>
              navigate(`/officer/applications/${record.applicationId}`)
            }
          >
            Xem
          </Button>
        ),
      },
    ],
    [navigate],
  );
}
