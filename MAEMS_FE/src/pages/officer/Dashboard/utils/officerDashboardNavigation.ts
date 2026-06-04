import type { ApplicationListFilter } from "../types";
import { OFFICER_APP_LIST_PATH } from "./officerDashboardConstants";

/** URL danh sách hồ sơ kèm query preset/status tương ứng. */
export function applicationListHref(f: ApplicationListFilter): string {
  if (f.kind === "all") return OFFICER_APP_LIST_PATH;
  if (f.kind === "preset") return `${OFFICER_APP_LIST_PATH}?preset=${f.preset}`;
  return `${OFFICER_APP_LIST_PATH}?status=${f.status}`;
}
