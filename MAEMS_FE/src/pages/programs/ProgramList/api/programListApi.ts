/**
 * Lớp API riêng cho feature danh sách chương trình —
 * tách biên feature khỏi api global, dễ mock/test sau này.
 */
export {
  getActiveProgramsBasic,
  getFilteredProgramsBasic,
} from "@/api/programs";

export { getActiveMajorsBasic } from "@/api/majors";
