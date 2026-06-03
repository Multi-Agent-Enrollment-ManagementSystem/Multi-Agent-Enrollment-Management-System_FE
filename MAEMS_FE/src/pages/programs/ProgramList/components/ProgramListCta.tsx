import { Typography } from "antd";
import { Link } from "react-router-dom";
import { PublicSectionReveal } from "@/components/public/PublicPageMotion";

const { Title, Paragraph } = Typography;

/** CTA cuối trang — dẫn người dùng sang đăng ký hoặc trang tuyển sinh. */
export function ProgramListCta() {
  return (
    <section className="py-16 px-6 bg-gradient-to-r from-orange-500 to-orange-600">
      <PublicSectionReveal className="max-w-3xl mx-auto text-center" amount={0.2}>
        <Title level={2} className="!text-white !font-extrabold !mb-3">
          Sẵn sàng bắt đầu hành trình?
        </Title>
        <Paragraph className="!text-orange-100 text-base !mb-6">
          Đăng ký ngay để được hệ thống AI hỗ trợ toàn bộ quy trình tuyển sinh
          tại Đại học FPT.
        </Paragraph>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/auth">
            <button className="bg-white text-orange-500 font-semibold px-8 py-3 rounded-full hover:bg-orange-50 transition-colors text-base shadow-md">
              Đăng ký tuyển sinh
            </button>
          </Link>
          <Link to="/tuyen-sinh">
            <button className="bg-white/15 border border-white/30 text-white font-semibold px-8 py-3 rounded-full hover:bg-white/25 transition-colors text-base backdrop-blur-sm">
              Xem thông tin tuyển sinh
            </button>
          </Link>
        </div>
      </PublicSectionReveal>
    </section>
  );
}
