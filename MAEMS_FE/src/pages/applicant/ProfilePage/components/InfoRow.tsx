import { Typography } from "antd";

const { Text } = Typography;

/** Dòng thông tin tài khoản với icon, nhãn và giá trị. */
export function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <span className="flex-shrink-0">{icon}</span>
      <Text className="text-xs text-gray-400 w-32 flex-shrink-0">{label}</Text>
      <Text className="text-sm text-gray-700 font-medium">{value}</Text>
    </div>
  );
}
