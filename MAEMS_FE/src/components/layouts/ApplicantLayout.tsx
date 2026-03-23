import type { ReactNode } from "react";
import { Layout } from "antd";
import { ApplicantHeader } from "../ApplicantHeader";
import { DashboardSidebar } from "../DashboardSidebar";
import type { SidebarMenuItem } from "../DashboardSidebar";

type ApplicantLayoutProps = {
  menuItems: SidebarMenuItem[];
  children: ReactNode;
};

export function ApplicantLayout({ menuItems, children }: ApplicantLayoutProps) {
  return (
    <Layout className="min-h-screen bg-gray-50">
      <DashboardSidebar menuItems={menuItems} />
      <Layout className="!bg-gray-50">
        <ApplicantHeader />
        <Layout.Content className="p-6 overflow-auto">{children}</Layout.Content>
      </Layout>
    </Layout>
  );
}
