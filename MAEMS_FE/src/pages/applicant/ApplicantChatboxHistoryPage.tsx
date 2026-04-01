import { useEffect, useState } from "react";
import { Card, Table, Typography, message } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { getChatboxHistory } from "../../api/chatbox";
import { ApplicantLayout } from "../../components/layouts/ApplicantLayout";
import { ApplicantMenu } from "./ApplicantMenu";
import type { ChatboxResponse } from "../../types/chatbox";

const { Title, Text } = Typography;

function formatDateTime(value: string): string {
  if (!value) return "--";
  return new Date(value).toLocaleString("vi-VN");
}

export function ApplicantChatboxHistoryPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ChatboxResponse[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await getChatboxHistory(pageNumber, pageSize);
        setRows(data.items ?? []);
        setTotalCount(data.totalCount ?? 0);
      } catch {
        messageApi.error("Không thể tải lịch sử chat. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    void fetchHistory();
  }, [messageApi, pageNumber, pageSize]);

  const columns: ColumnsType<ChatboxResponse> = [
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 190,
      render: (value: string) => (
        <Text className="text-gray-500">{formatDateTime(value)}</Text>
      ),
    },
    {
      title: "Câu hỏi",
      dataIndex: "question",
      key: "question",
      render: (value: string) => (
        <Text className="whitespace-pre-wrap break-words">{value || "--"}</Text>
      ),
    },
    {
      title: "Trả lời",
      dataIndex: "answer",
      key: "answer",
      render: (value: string) => (
        <Text className="whitespace-pre-wrap break-words">{value || "--"}</Text>
      ),
    },
  ];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPageNumber(pagination.current ?? 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  return (
    <ApplicantLayout menuItems={ApplicantMenu}>
      {contextHolder}
      <div className="space-y-4">
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 shadow-sm">
          <Title level={4} className="!mb-1 !text-white">
            Lịch sử chat với trợ lý AI
          </Title>
          <Text className="!text-orange-50">
            Xem lại toàn bộ hỏi đáp từ trợ lý AI theo từng thời điểm.
          </Text>
        </div>

        <Card className="rounded-2xl border border-gray-100 shadow-sm">
          <Table<ChatboxResponse>
            rowKey="chatId"
            loading={loading}
            columns={columns}
            dataSource={rows}
            pagination={{
              current: pageNumber,
              pageSize,
              total: totalCount,
              showSizeChanger: true,
              pageSizeOptions: [10, 20, 50],
              showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} tin nhắn`,
            }}
            onChange={handleTableChange}
            scroll={{ x: 900 }}
          />
        </Card>
      </div>
    </ApplicantLayout>
  );
}
