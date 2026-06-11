import type { DocUploadItem } from "../types";

/** Giải phóng bộ nhớ object URL preview khi không còn hiển thị. */
export function revokeDocItemPreviews(items: DocUploadItem[]) {
  items.forEach((item) => {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
  });
}
