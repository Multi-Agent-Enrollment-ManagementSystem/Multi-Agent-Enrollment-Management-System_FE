import { Typography } from "antd";
import {
  ArrowRight,
  BriefcaseBusiness,
  Clock,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { ProgramListItem } from "../types";
import { getMajorColor } from "../utils/majorColors";

const { Title, Paragraph, Text } = Typography;

type ProgramCardProps = {
  program: ProgramListItem;
};

/** Thẻ hiển thị một chương trình đào tạo trong lưới danh sách. */
export function ProgramCard({ program }: ProgramCardProps) {
  return (
    <Link to={`/dao-tao/${program.programId}`} className="h-full block group">
      <div className="h-full flex flex-col bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-orange-400 to-orange-500 group-hover:from-orange-500 group-hover:to-orange-600 transition-colors" />
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <GraduationCap size={22} className="text-orange-500" />
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getMajorColor(0)}`}
            >
              {program.majorName}
            </span>
          </div>

          <Title
            level={5}
            className="!text-gray-800 !mb-2 !font-bold !leading-snug group-hover:!text-orange-600 transition-colors"
          >
            {program.programName}
          </Title>

          <Paragraph
            className="!text-gray-500 text-sm !mb-4 flex-1"
            ellipsis={{ rows: 3 }}
          >
            {program.description ||
              "Chương trình đào tạo chất lượng cao tại Đại học FPT."}
          </Paragraph>

          <div className="space-y-2 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={14} className="text-orange-400 flex-shrink-0" />
              <span>
                Thời gian:{" "}
                <span className="font-medium text-gray-700">
                  {program.duration || "4 năm"}
                </span>
              </span>
            </div>
            {program.careerProspects && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <BriefcaseBusiness
                  size={14}
                  className="text-orange-400 flex-shrink-0 mt-0.5"
                />
                <Text
                  className="!text-gray-600 text-sm"
                  ellipsis={{ tooltip: program.careerProspects }}
                >
                  {program.careerProspects}
                </Text>
              </div>
            )}
            <div className="flex items-center justify-end pt-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-orange-500 group-hover:gap-2 transition-all">
                Xem chi tiết <ArrowRight size={13} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
