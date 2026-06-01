import { Typography } from "antd";
import { Sparkles } from "lucide-react";
import { CampusHeroBackground } from "@/components/CampusHeroBackground";

const { Title, Paragraph, Text } = Typography;

/** Hero 50vh — đủ chỗ cho tiêu đề, tránh chiếm full màn hình khi ít nội dung. */
export function ProgramListHero() {
  return (
    <section className="relative min-h-[50vh] px-6 py-10 overflow-hidden flex flex-col items-center justify-center">
      <CampusHeroBackground />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
          <Sparkles size={14} className="text-orange-300" />
          <Text className="!text-orange-200 text-sm font-medium">
            Trường Đại học FPT — Đào tạo chất lượng quốc tế
          </Text>
        </div>
        <Title
          level={1}
          className="!text-white !text-4xl md:!text-5xl !font-extrabold !leading-tight !mb-4"
        >
          Chương trình <span className="text-orange-400">Đào tạo</span>
        </Title>
        <Paragraph className="!text-gray-200 text-lg max-w-2xl mx-auto !mb-0">
          Khám phá các ngành học tiên tiến, gắn kết doanh nghiệp và định hướng
          nghề nghiệp rõ ràng tại Đại học FPT.
        </Paragraph>
      </div>
    </section>
  );
}
