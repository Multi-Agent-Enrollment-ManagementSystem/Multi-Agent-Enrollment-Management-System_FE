import {
  getActiveAdmissionTypesBasic,
  getAdmissionTypeById,
} from "@/api/admission-types";
import {
  fetchAllApplications,
  patchApplication,
  requestAdditionalDocuments,
} from "@/api/applications";
import { getActiveBasicCampuses } from "@/api/campuses";
import { getActiveProgramsBasic } from "@/api/programs";

export {
  fetchAllApplications,
  patchApplication,
  requestAdditionalDocuments,
  getAdmissionTypeById,
};

/** Tải song song dữ liệu dropdown bộ lọc (cơ sở, ngành, phương thức). */
export async function loadOfficerListFilterOptions() {
  const [campuses, programs, admissionTypes] = await Promise.all([
    getActiveBasicCampuses(),
    getActiveProgramsBasic(),
    getActiveAdmissionTypesBasic(),
  ]);
  return { campuses, programs, admissionTypes };
}
