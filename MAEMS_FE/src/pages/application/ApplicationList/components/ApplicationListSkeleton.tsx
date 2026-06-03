import { Card, Skeleton } from "antd";
import {
  applicationListPanelClassName,
  applicationListPanelStyle,
} from "../utils/applicationListPanel";

/** Placeholder khi đang tải — bo góc khớp panel filter + bảng thật. */
export function ApplicationListSkeleton() {
  return (
    <div className="mb-16 flex flex-col gap-4 pb-10 sm:mb-20 sm:pb-14 animate-pulse">
      <Card
        className={`${applicationListPanelClassName} shadow-sm`}
        style={applicationListPanelStyle}
        styles={{ body: { padding: "18px 20px" } }}
      >
        <Skeleton.Input active className="!w-full !h-10 !rounded-2xl mb-3" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton.Input
              key={i}
              active
              className="!w-full !h-9 !rounded-2xl"
            />
          ))}
        </div>
      </Card>

      <Card
        className={applicationListPanelClassName}
        style={applicationListPanelStyle}
        styles={{ body: { padding: 0 } }}
      >
        <div className="px-5 py-4 border-b border-gray-100">
          <Skeleton.Input active className="!w-40 !h-6 !rounded-xl" />
        </div>
        <div className="p-5 space-y-3">
          {[0, 1, 2, 4, 5].map((i) => (
            <Skeleton
              key={i}
              active
              title={{ width: "32%" }}
              paragraph={{ rows: 1, width: "60%" }}
              className="!rounded-2xl"
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
