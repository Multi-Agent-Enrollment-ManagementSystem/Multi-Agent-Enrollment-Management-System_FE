import { Layout } from "antd";
import type { ReactNode } from "react";
import { AppHeader } from "../../../components/AppHeader";

const { Content } = Layout;

type AuthPageLayoutProps = {
  children: ReactNode;
};

/** Layout nền gradient + header cho toàn trang xác thực. */
export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <Layout
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #ff6a00 0%, #ee7f1a 25%, #f97316 50%, #c2410c 75%, #7c2d12 100%)",
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />

      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.13) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(251,146,60,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <AppHeader />

        <Content className="w-full py-6 px-4 sm:px-6 md:px-10 pb-20 box-border flex-1">
          {children}
        </Content>
      </div>
    </Layout>
  );
}
