import { Typography } from "antd";

const { Text } = Typography;

/** Ô hiển thị một trường dữ liệu ở chế độ chỉ đọc trong grid hồ sơ. */
export function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <Text className="!text-xs !text-gray-400">{label}</Text>
      <Text className="!text-sm !text-gray-800 !font-medium">
        {value ?? "—"}
      </Text>
    </div>
  );
}
