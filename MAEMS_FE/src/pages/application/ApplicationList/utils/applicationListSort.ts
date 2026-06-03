import type { ApplicationMe } from "@/types/application";
import { ensureUtc } from "@/utils/date";
import type {
  ApplicationListSortField,
  ApplicationListSortState,
} from "../types";

/** Mặc định khi mount: ngày nộp mới nhất lên đầu. */
export const DEFAULT_APPLICATION_LIST_SORT: ApplicationListSortState = {
  field: "submittedAt",
  order: "descend",
};

/** Chuyển ISO sang ms; đơn chưa có ngày xếp cuối khi sort desc. */
function toSortableMs(iso?: string | null): number {
  if (!iso?.trim()) return Number.NEGATIVE_INFINITY;
  return new Date(ensureUtc(iso)).getTime();
}

/** Sắp xếp client-side sau bước lọc — đồng bộ với cột bảng Ant Design. */
export function sortApplicationList(
  apps: ApplicationMe[],
  field: ApplicationListSortField,
  order: ApplicationListSortState["order"],
): ApplicationMe[] {
  const dir = order === "descend" ? -1 : 1;

  return [...apps].sort((a, b) => {
    let cmp = 0;

    if (field === "applicationId") {
      cmp = a.applicationId - b.applicationId;
    } else if (field === "submittedAt") {
      cmp = toSortableMs(a.submittedAt) - toSortableMs(b.submittedAt);
    } else {
      cmp = toSortableMs(a.lastUpdated) - toSortableMs(b.lastUpdated);
    }

    if (cmp === 0) {
      cmp = a.applicationId - b.applicationId;
    }

    return cmp * dir;
  });
}
