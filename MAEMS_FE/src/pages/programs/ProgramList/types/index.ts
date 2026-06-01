import type { Program, ProgramBasic } from "@/types/program";

/** Một chương trình trên danh sách — basic từ API, có thể bổ sung field đầy đủ khi cần hiển thị. */
export type ProgramListItem = ProgramBasic & Partial<Program>;

/** Giá trị sort key gửi lên API (field + hướng). */
export type ProgramSortKey =
  | ""
  | "programName_asc"
  | "programName_desc"
  | "majorName_asc"
  | "majorName_desc";
