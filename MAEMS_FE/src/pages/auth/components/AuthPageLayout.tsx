import { Layout } from "antd";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/AppHeader";
import { CampusHeroBackground } from "@/components/CampusHeroBackground";

const { Content } = Layout;

type AuthPageLayoutProps = {
  children: ReactNode;
};

/** Layout nền ảnh khuôn viên + header cho toàn trang xác thực. */
export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <Layout className="min-h-screen relative overflow-hidden !bg-transparent">
      <CampusHeroBackground fixed />
      {/* Lớp tối nhẹ giúp form đăng nhập nổi bật trên ảnh nền */}
      <div className="absolute inset-0 bg-black/45 z-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col min-h-screen">
        <AppHeader />

        <Content className="w-full py-6 px-4 sm:px-6 md:px-10 pb-20 box-border flex-1">
          {children}
        </Content>
      </div>
    </Layout>
  );
}
