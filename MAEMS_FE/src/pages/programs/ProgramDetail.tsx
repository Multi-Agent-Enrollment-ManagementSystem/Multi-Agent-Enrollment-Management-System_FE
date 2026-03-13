import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Typography, Skeleton, Divider, Result, Button } from "antd";
import {
  ArrowLeft,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { AppHeader } from "../../components/AppHeader";
import { getProgramById } from "../../api/programs";
import type { Program } from "../../types/program";

const { Title, Paragraph, Text } = Typography;

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-4 border-b border-gray-100 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>
      <div>
        <Text className="!text-gray-400 text-xs uppercase tracking-wide block mb-0.5">
          {label}
        </Text>
        <Text className="!text-gray-800 text-sm font-medium">{value}</Text>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Skeleton active paragraph={{ rows: 2 }} className="mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton active paragraph={{ rows: 6 }} />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
        <div>
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    </div>
  );
}

export function ProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function fetchProgram() {
      setLoading(true);
      try {
        const data = await getProgramById(id!);
        if (!data) { setNotFound(true); return; }
        setProgram(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    void fetchProgram();
  }, [id]);

  return (
    <div className="min-h-screen bg-white">
      <AppHeader />

      {loading ? (
        <DetailSkeleton />
      ) : notFound || !program ? (
        <div className="pt-20">
          <Result
            status="404"
            title="Không tìm thấy chương trình"
            subTitle="Chương trình đào tạo này không tồn tại hoặc đã bị xóa."
            extra={
              <Button
                type="primary"
                className="!bg-orange-500 !border-orange-500"
                onClick={() => navigate("/dao-tao")}
              >
                Quay lại danh sách
              </Button>
            }
          />
        </div>
      ) : (
        <>
          {/* Hero */}
          <section className="relative py-20 px-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 via-orange-700/70 to-gray-900/90" />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="relative z-10 max-w-5xl mx-auto">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-sm mb-6 text-orange-200/80">
                <Link to="/" className="!text-orange-200/80 hover:!text-orange-300 transition-colors">
                  Trang chủ
                </Link>
                <ChevronRight size={13} />
                <Link to="/dao-tao" className="!text-orange-200/80 hover:!text-orange-300 transition-colors">
                  Đào tạo
                </Link>
                <ChevronRight size={13} />
                <span className="text-white font-medium truncate max-w-xs">
                  {program.programName}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-white/15 border border-white/25 text-orange-100 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                  {program.majorName}
                </span>
                {program.isActive ? (
                  <span className="bg-green-500/20 border border-green-400/30 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
                    Đang tuyển sinh
                  </span>
                ) : (
                  <span className="bg-gray-500/20 border border-gray-400/30 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">
                    Tạm ngừng
                  </span>
                )}
              </div>

              <Title
                level={1}
                className="!text-white !text-3xl md:!text-4xl !font-extrabold !leading-tight !mb-3"
              >
                {program.programName}
              </Title>

              <div className="flex flex-wrap gap-5 mt-5">
                {[
                  { icon: <Clock size={14} />, text: program.duration || "4 năm" },
                  { icon: <BookOpen size={14} />, text: program.majorName },
                  { icon: <CalendarDays size={14} />, text: `Năm tuyển sinh: ${program.enrollmentYear || "—"}` },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="flex items-center gap-1.5 text-orange-100 text-sm"
                  >
                    <span className="text-orange-300">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Content */}
          <section className="py-14 px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Main */}
              <div className="lg:col-span-2 space-y-10">
                {/* Description */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-orange-500 rounded-full" />
                    <Title level={4} className="!mb-0 !text-gray-800 !font-bold">
                      Giới thiệu chương trình
                    </Title>
                  </div>
                  <Paragraph className="!text-gray-600 text-base leading-relaxed !mb-0">
                    {program.description ||
                      "Chương trình đào tạo chất lượng cao theo chuẩn quốc tế tại Đại học FPT, trang bị cho sinh viên kiến thức chuyên sâu và kỹ năng thực tiễn."}
                  </Paragraph>
                </div>

                <Divider className="!my-0" />

                {/* Career Prospects */}
                {program.careerProspects && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-6 bg-orange-500 rounded-full" />
                      <Title level={4} className="!mb-0 !text-gray-800 !font-bold">
                        Triển vọng nghề nghiệp
                      </Title>
                    </div>
                    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
                      <div className="flex items-start gap-3">
                        <BriefcaseBusiness size={20} className="text-orange-500 mt-0.5 flex-shrink-0" />
                        <Paragraph className="!text-gray-700 text-base leading-relaxed !mb-0">
                          {program.careerProspects}
                        </Paragraph>
                      </div>
                    </div>
                  </div>
                )}

                {/* Highlights */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-orange-500 rounded-full" />
                    <Title level={4} className="!mb-0 !text-gray-800 !font-bold">
                      Điểm nổi bật
                    </Title>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      "Chương trình chuẩn quốc tế, cập nhật liên tục",
                      "Gắn kết doanh nghiệp, thực tập có trả lương",
                      "Đội ngũ giảng viên giàu kinh nghiệm thực tế",
                      "Cơ sở vật chất hiện đại, môi trường học tập năng động",
                      "Hỗ trợ học bổng và cơ hội du học quốc tế",
                      "Tỷ lệ có việc làm sau tốt nghiệp trên 95%",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100"
                      >
                        <CheckCircle2 size={15} className="text-orange-400 flex-shrink-0 mt-0.5" />
                        <Text className="!text-gray-700 text-sm">{item}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick info card */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-orange-400 to-orange-500" />
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap size={18} className="text-orange-500" />
                      <Text strong className="!text-gray-800 text-sm">
                        Thông tin chương trình
                      </Text>
                    </div>
                    <div>
                      <InfoRow
                        icon={<BookOpen size={15} className="text-orange-500" />}
                        label="Khoa / Ngành"
                        value={program.majorName}
                      />
                      <InfoRow
                        icon={<Clock size={15} className="text-orange-500" />}
                        label="Thời gian đào tạo"
                        value={program.duration || "4 năm"}
                      />
                      <InfoRow
                        icon={<CalendarDays size={15} className="text-orange-500" />}
                        label="Năm tuyển sinh"
                        value={program.enrollmentYear || "—"}
                      />
                      <InfoRow
                        icon={<Sparkles size={15} className="text-orange-500" />}
                        label="Trạng thái"
                        value={program.isActive ? "Đang tuyển sinh" : "Tạm ngừng"}
                      />
                    </div>
                  </div>
                </div>

                {/* CTA card */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-center shadow-md">
                  <GraduationCap size={32} className="text-white mx-auto mb-3" />
                  <Text strong className="!text-white text-base block mb-2">
                    Quan tâm đến ngành này?
                  </Text>
                  <Paragraph className="!text-orange-100 text-sm !mb-5">
                    Đăng ký tuyển sinh ngay để được tư vấn và hỗ trợ từ hệ thống AI.
                  </Paragraph>
                  <Link to="/auth">
                    <button className="w-full bg-white text-orange-500 font-semibold py-2.5 rounded-xl hover:bg-orange-50 transition-colors text-sm shadow-sm">
                      Đăng ký ngay
                    </button>
                  </Link>
                  <Link to="/tuyen-sinh">
                    <button className="w-full mt-2.5 bg-white/15 border border-white/30 text-white font-semibold py-2.5 rounded-xl hover:bg-white/25 transition-colors text-sm">
                      Xem thông tin tuyển sinh
                    </button>
                  </Link>
                </div>

                {/* Back button */}
                <button
                  onClick={() => navigate("/dao-tao")}
                  className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-orange-500 py-3 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors bg-white"
                >
                  <ArrowLeft size={15} />
                  Quay lại danh sách
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
