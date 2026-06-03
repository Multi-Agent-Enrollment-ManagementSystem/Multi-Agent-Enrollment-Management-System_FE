import { PublicSectionReveal } from "@/components/public/PublicPageMotion";

type ProgramListStatsBarProps = {
  totalCount: number;
  majorCount: number;
};

/** Thanh thống kê nhanh — hiển thị số chương trình và khoa đang có. */
export function ProgramListStatsBar({
  totalCount,
  majorCount,
}: ProgramListStatsBarProps) {
  const stats = [
    {
      label: "Ngành đào tạo",
      value: totalCount > 0 ? `${totalCount}+` : "—",
    },
    {
      label: "Khoa chuyên ngành",
      value: majorCount > 0 ? `${majorCount}` : "—",
    },
    { label: "Năm kinh nghiệm", value: "20+" },
    { label: "Sinh viên tốt nghiệp", value: "50,000+" },
  ];

  return (
    <div className="bg-orange-500 py-4 px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8">
        {stats.map((s, i) => (
          <PublicSectionReveal key={s.label} delay={i * 0.06} amount={0.3}>
          <div className="text-center">
            <div className="text-white font-extrabold text-2xl">{s.value}</div>
            <div className="text-orange-100 text-xs mt-0.5">{s.label}</div>
          </div>
          </PublicSectionReveal>
        ))}
      </div>
    </div>
  );
}
