import type { CSSProperties } from "react";

/** Bán kính bo góc panel filter + bảng — đủ lớn để không bị theme Ant Design làm vuông. */
export const APPLICATION_LIST_PANEL_RADIUS_PX = 36;

/** Style inline ép bo góc Card (ưu tiên hơn token mặc định của antd). */
export const applicationListPanelStyle: CSSProperties = {
  borderRadius: APPLICATION_LIST_PANEL_RADIUS_PX,
  overflow: "hidden",
};

/**
 * Class Tailwind bổ trợ cho Card panel — kết hợp với `applicationListPanelStyle`.
 * Dùng chung cho filter group và table group.
 */
export const applicationListPanelClassName =
  "!rounded-[36px] overflow-hidden border border-gray-200/70 bg-white/90 shadow-lg shadow-gray-900/[0.04] [&_.ant-card-body]:!rounded-[36px]";

/** Class cho vùng pagination/table bên dưới — bo góc dưới khớp panel. */
export const applicationListPanelBottomClassName = "!rounded-b-[36px]";
