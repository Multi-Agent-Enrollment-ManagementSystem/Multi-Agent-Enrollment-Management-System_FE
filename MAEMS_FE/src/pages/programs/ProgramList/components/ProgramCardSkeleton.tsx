import { Skeleton } from "antd";

/** Placeholder loading cho thẻ chương trình — giữ layout ổn định khi fetch. */
export function ProgramCardSkeleton() {
  return (
    <div className="h-full bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <Skeleton active paragraph={{ rows: 4 }} />
    </div>
  );
}
