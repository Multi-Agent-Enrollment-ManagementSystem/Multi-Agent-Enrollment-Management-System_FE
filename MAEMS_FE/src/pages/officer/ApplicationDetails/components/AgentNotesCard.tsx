import { Button, Card, Typography } from "antd";
import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import type { Application } from "../../../../types/application";

const { Title, Text } = Typography;

type AgentNotesCardProps = {
  app: Application;
  expanded: boolean;
  onToggleExpanded: () => void;
};

/** Thẻ ghi chú từ agent hệ thống — có thu gọn khi nội dung dài */
export function AgentNotesCard({
  app,
  expanded,
  onToggleExpanded,
}: AgentNotesCardProps) {
  return (
    <Card
      className={`rounded-2xl shadow-sm ${app.notes ? "border border-indigo-100 bg-indigo-50" : "border border-gray-100"}`}
      styles={{ body: { padding: "20px 24px" } }}
    >
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck
          size={18}
          className={app.notes ? "text-indigo-500" : "text-gray-300"}
        />
        <Title
          level={5}
          className={`!mb-0 ${app.notes ? "!text-indigo-700" : "!text-gray-400"}`}
        >
          Ghi chú từ Agent hệ thống
        </Title>
        {app.notes && (
          <Button
            type="text"
            size="small"
            icon={
              expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />
            }
            className="!text-indigo-500"
            onClick={onToggleExpanded}
          />
        )}
      </div>
      {app.notes ? (
        <Text
          className={`text-sm text-gray-700 font-mono whitespace-pre-wrap ${expanded ? "" : "line-clamp-3"}`}
        >
          {app.notes}
        </Text>
      ) : (
        <Text className="text-sm text-gray-400 italic">
          Chưa có ghi chú từ agent hệ thống.
        </Text>
      )}
    </Card>
  );
}
