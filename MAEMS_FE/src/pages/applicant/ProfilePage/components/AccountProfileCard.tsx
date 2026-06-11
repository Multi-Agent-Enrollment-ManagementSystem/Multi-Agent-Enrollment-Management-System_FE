import { Avatar, Badge, Card, Skeleton, Typography } from "antd";
import { CalendarDays, Mail, ShieldCheck, User } from "lucide-react";
import { motion } from "motion/react";
import type { UserProfile } from "@/types/auth";
import { ROLE_LABEL } from "../utils/applicantProfileConstants";
import { formatProfileDate } from "../utils/formatProfileDate";
import { InfoRow } from "./InfoRow";

const { Title, Text } = Typography;

type AccountProfileCardProps = {
  loading: boolean;
  profile: UserProfile | null;
  initial: string;
};

/** Card hiển thị thông tin tài khoản đăng nhập của thí sinh. */
export function AccountProfileCard({
  loading,
  profile,
  initial,
}: AccountProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      whileHover={{ y: -2 }}
    >
      <Card className="w-full rounded-[36px] border border-gray-100/90 bg-white/90 shadow-sm backdrop-blur-[2px] transition-shadow duration-300 hover:shadow-md [&_.ant-card-body]:!p-4 sm:[&_.ant-card-body]:!p-6 lg:[&_.ant-card-body]:!p-8">
        {loading ? (
          <div className="flex items-center gap-6">
            <Skeleton.Avatar active size={80} />
            <div className="flex-1">
              <Skeleton active paragraph={{ rows: 3 }} title={false} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar
              size={80}
              className="!bg-orange-500 !text-white text-3xl font-bold select-none flex-shrink-0"
            >
              {initial}
            </Avatar>

            <div className="flex-1 w-full">
              <div className="text-center sm:text-left mb-5">
                <Title level={4} className="!mb-0 !text-gray-800">
                  {profile?.username ?? "—"}
                </Title>
                <Badge
                  color="orange"
                  text={
                    <Text className="text-orange-600 text-xs font-medium">
                      {ROLE_LABEL[profile?.role ?? ""] ?? profile?.role}
                    </Text>
                  }
                />
              </div>

              <div className="space-y-3">
                <InfoRow
                  icon={<User size={15} className="text-gray-400" />}
                  label="Tên đăng nhập"
                  value={profile?.username ?? "—"}
                />
                <InfoRow
                  icon={<Mail size={15} className="text-gray-400" />}
                  label="Email"
                  value={profile?.email || "Chưa cập nhật"}
                />
                <InfoRow
                  icon={<ShieldCheck size={15} className="text-gray-400" />}
                  label="Vai trò"
                  value={
                    ROLE_LABEL[profile?.role ?? ""] ?? profile?.role ?? "—"
                  }
                />
                <InfoRow
                  icon={<CalendarDays size={15} className="text-gray-400" />}
                  label="Ngày tham gia"
                  value={
                    profile?.createdAt ? formatProfileDate(profile.createdAt) : "—"
                  }
                />
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
