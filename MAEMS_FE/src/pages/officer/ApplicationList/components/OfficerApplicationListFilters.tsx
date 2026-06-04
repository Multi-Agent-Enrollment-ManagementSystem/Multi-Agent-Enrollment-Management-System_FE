import { AlertTriangle, Search } from "lucide-react";
import { Button, Card, Col, Input, Row, Select, Tag, Typography } from "antd";
import type { AdmissionTypeBasic } from "@/types/admission.type";
import type { ApplicationStatus } from "@/types/application";
import type { ApplicationLevel } from "@/types/enums";
import type { CampusBasic } from "@/types/campus";
import type { ProgramBasic } from "@/types/program";
import type {
  ApplicationLevelKey,
  ApplicationListSortOption,
  FilterDimensionAvailability,
} from "../types";
import { SELECT_DISABLED_OPTION_CURSOR } from "../utils/officerApplicationListConstants";
import { dimOptionDisabled } from "../utils/officerApplicationListFacet";
import {
  LEVEL_TAG_CONFIG,
  statusConfig,
} from "../utils/officerApplicationListStatus";

const { Text } = Typography;
const { Option } = Select;

type OfficerApplicationListFiltersProps = {
  presetHint: string | null;
  searchInput: string;
  onSearchChange: (value: string) => void;
  filterStatus: ApplicationStatus | "all";
  onStatusChange: (val: ApplicationStatus | "all") => void;
  filterCampusId: number | "all";
  onCampusChange: (val: number | "all") => void;
  filterProgramId: number | "all";
  onProgramChange: (val: number | "all") => void;
  filterAdmissionTypeId: number | "all";
  onAdmissionTypeChange: (val: number | "all") => void;
  filterLevel: ApplicationLevel | "all";
  onLevelChange: (val: ApplicationLevel | "all") => void;
  currentSortOption: ApplicationListSortOption;
  onSortChange: (val: ApplicationListSortOption) => void;
  onlyEscalated: boolean;
  onEscalatedChange: (checked: boolean) => void;
  facetReady: boolean;
  filterAvailability: FilterDimensionAvailability;
  campuses: CampusBasic[];
  programs: ProgramBasic[];
  admissionTypes: AdmissionTypeBasic[];
  activeFilterCount: number;
  onClearFilters: () => void;
};

/** Thẻ bộ lọc server-side — facet disable option không còn trong tập ứng viên. */
export function OfficerApplicationListFilters({
  presetHint,
  searchInput,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterCampusId,
  onCampusChange,
  filterProgramId,
  onProgramChange,
  filterAdmissionTypeId,
  onAdmissionTypeChange,
  filterLevel,
  onLevelChange,
  currentSortOption,
  onSortChange,
  onlyEscalated,
  onEscalatedChange,
  facetReady,
  filterAvailability,
  campuses,
  programs,
  admissionTypes,
  activeFilterCount,
  onClearFilters,
}: OfficerApplicationListFiltersProps) {
  return (
    <Card
      className="rounded-2xl border border-gray-100 shadow-sm"
      styles={{ body: { padding: "16px 20px" } }}
    >
      {presetHint && (
        <Text className="text-xs text-violet-600 block mb-3">{presetHint}</Text>
      )}
      <Row gutter={[12, 12]} align="middle">
        <Col xs={24} md={6}>
          <Input
            placeholder="Tìm mã hồ sơ, thí sinh, ngành..."
            prefix={<Search size={14} className="text-gray-300" />}
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
            onClear={() => onSearchChange("")}
            className="!rounded-xl"
          />
        </Col>

        <Col xs={12} md={4}>
          <Select
            value={filterStatus}
            onChange={onStatusChange}
            className="w-full !rounded-xl"
            placeholder="Trạng thái"
            popupClassName={SELECT_DISABLED_OPTION_CURSOR}
          >
            <Option value="all">Tất cả trạng thái</Option>
            {(Object.keys(statusConfig) as ApplicationStatus[]).map((s) => (
              <Option
                key={s}
                value={s}
                disabled={dimOptionDisabled(
                  facetReady,
                  filterAvailability.statuses.has(s),
                  filterStatus === s,
                )}
              >
                {statusConfig[s].label}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={12} md={4}>
          <Select
            value={filterCampusId}
            onChange={onCampusChange}
            className="w-full !rounded-xl"
            placeholder="Cơ sở"
            popupClassName={SELECT_DISABLED_OPTION_CURSOR}
          >
            <Option value="all">Tất cả cơ sở</Option>
            {campuses.map((campus) => (
              <Option
                key={campus.campusId}
                value={campus.campusId}
                disabled={dimOptionDisabled(
                  facetReady,
                  filterAvailability.campusIds.has(campus.campusId),
                  filterCampusId === campus.campusId,
                )}
              >
                {campus.name}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={12} md={4}>
          <Select
            value={filterProgramId}
            onChange={onProgramChange}
            className="w-full !rounded-xl"
            placeholder="Ngành"
            showSearch
            optionFilterProp="children"
            popupClassName={SELECT_DISABLED_OPTION_CURSOR}
          >
            <Option value="all">Tất cả ngành</Option>
            {programs.map((program) => (
              <Option
                key={program.programId}
                value={program.programId}
                disabled={dimOptionDisabled(
                  facetReady,
                  filterAvailability.programIds.has(program.programId),
                  filterProgramId === program.programId,
                )}
              >
                {program.programName}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={12} md={4}>
          <Select
            value={filterAdmissionTypeId}
            onChange={onAdmissionTypeChange}
            className="w-full !rounded-xl"
            placeholder="Phương thức"
            popupClassName={SELECT_DISABLED_OPTION_CURSOR}
          >
            <Option value="all">Tất cả phương thức</Option>
            {admissionTypes.map((admissionType) => (
              <Option
                key={admissionType.admissionTypeId}
                value={admissionType.admissionTypeId}
                disabled={dimOptionDisabled(
                  facetReady,
                  filterAvailability.admissionTypeIds.has(
                    admissionType.admissionTypeId,
                  ),
                  filterAdmissionTypeId === admissionType.admissionTypeId,
                )}
              >
                {admissionType.admissionTypeName}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={12} md={4}>
          <Select
            value={filterLevel}
            onChange={onLevelChange}
            className="w-full !rounded-xl"
            placeholder="Xếp hạng"
          >
            <Option value="all">Tất cả xếp hạng</Option>
            {(Object.keys(LEVEL_TAG_CONFIG) as ApplicationLevelKey[]).map(
              (lvl) => (
                <Option key={lvl} value={lvl}>
                  <Tag
                    color={LEVEL_TAG_CONFIG[lvl].color}
                    className="text-xs !m-0"
                  >
                    {LEVEL_TAG_CONFIG[lvl].label.toUpperCase()}
                  </Tag>
                </Option>
              ),
            )}
          </Select>
        </Col>

        <Col xs={12} md={4}>
          <Select
            value={currentSortOption}
            onChange={onSortChange}
            className="w-full !rounded-xl"
            placeholder="Sắp xếp"
          >
            <Option value="applicationId_desc">Mã hồ sơ: mới nhất</Option>
            <Option value="applicationId_asc">Mã hồ sơ: cũ nhất</Option>
            <Option value="lastUpdated_desc">Cập nhật: mới nhất</Option>
            <Option value="lastUpdated_asc">Cập nhật: cũ nhất</Option>
          </Select>
        </Col>

        <Col xs={12} md={4}>
          <Select
            value={onlyEscalated ? "escalated" : "all"}
            onChange={(v) => onEscalatedChange(v === "escalated")}
            className="w-full !rounded-xl"
            popupClassName={SELECT_DISABLED_OPTION_CURSOR}
          >
            <Option value="all">Tất cả hồ sơ</Option>
            <Option
              value="escalated"
              disabled={dimOptionDisabled(
                facetReady,
                filterAvailability.anyRequiresReview,
                onlyEscalated,
              )}
            >
              <span className="flex items-center gap-1 text-rose-600">
                <AlertTriangle size={13} />
                Hồ sơ cần xem xét
              </span>
            </Option>
          </Select>
        </Col>

        {activeFilterCount > 0 && (
          <Col xs={24} md={2}>
            <Button
              size="small"
              type="link"
              className="!p-0 !text-gray-400"
              onClick={onClearFilters}
            >
              Xoá bộ lọc ({activeFilterCount})
            </Button>
          </Col>
        )}
      </Row>
    </Card>
  );
}
