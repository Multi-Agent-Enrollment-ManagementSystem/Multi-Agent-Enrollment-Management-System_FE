import { getProfile } from "@/api/users";
import {
  createApplicant,
  getMyApplicant,
  patchApplicant,
  uploadApplicantDocuments,
  getApplicantDocuments,
} from "@/api/applicants";
import { deleteDocument } from "@/api/documents";

/** Lớp API riêng cho trang hồ sơ thí sinh — gom các endpoint liên quan một chỗ. */
export {
  getProfile,
  getMyApplicant,
  createApplicant,
  patchApplicant,
  getApplicantDocuments,
  uploadApplicantDocuments,
  deleteDocument,
};
