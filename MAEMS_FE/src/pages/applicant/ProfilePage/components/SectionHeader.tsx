import { Typography } from "antd";

const { Text } = Typography;

/** Tiêu đề section trong card hồ sơ — icon + nhãn uppercase. */
export function SectionHeader({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-orange-500">{icon}</span>
      <Text className="!text-gray-600 !font-semibold !text-sm uppercase tracking-wide">
        {title}
      </Text>
    </div>
  );
}
