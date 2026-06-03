import { Button, Card, Empty, Typography } from "antd";
import { motion } from "motion/react";
import { PlusCircle, RefreshCw, XCircle } from "lucide-react";
import { ApplicantLayout } from "@/layouts/ApplicantLayout";
import { ApplicantMenu } from "@/pages/applicant/ApplicantMenu";
import {
  ApplicationListFilters,
  ApplicationListSkeleton,
  ApplicationListTableSection,
  QrPaymentModal,
} from "./components";
import { useApplicationList } from "./hooks";

const { Title, Text } = Typography;

/** Trang danh sách đơn đăng ký của ứng viên — ghép layout và các section UI. */
export function ApplicationList() {
  const {
    messageContextHolder,
    qrModal,
    handleQrPaid,
    handleQrClose,
    handleQrExpire,
    loading,
    error,
    apps,
    sortedFilteredApps,
    hasActiveFilters,
    clearFilters,
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
    programFilter,
    setProgramFilter,
    campusFilter,
    setCampusFilter,
    admissionFilter,
    setAdmissionFilter,
    statusOptions,
    programOptions,
    campusOptions,
    admissionOptions,
    applicationColumns,
    handleSubmitFinal,
    submittingId,
    goToApplicationDetail,
    goToNewApplication,
    handleTableChange,
    reload,
  } = useApplicationList();

  return (
    <ApplicantLayout menuItems={ApplicantMenu}>
      {messageContextHolder}

      {qrModal && (
        <QrPaymentModal
          open
          url={qrModal.url}
          transactionId={qrModal.transactionId}
          amount={qrModal.amount}
          onPaid={handleQrPaid}
          onClose={handleQrClose}
          onExpire={handleQrExpire}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-start justify-between mb-5 sm:mb-6 flex-wrap gap-3"
      >
        <div className="min-w-0">
          <Title
            level={4}
            className="!mb-0.5 !text-gray-800 !font-bold !text-lg sm:!text-xl"
          >
            Đơn đăng ký của tôi
          </Title>
          <Text className="text-xs sm:text-sm text-gray-500">
            Xem và quản lý tất cả các đơn đăng ký của bạn
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusCircle size={15} />}
          className="!rounded-2xl !h-10 !px-5 !bg-orange-500 !border-orange-500 hover:!bg-orange-600 shadow-md shadow-orange-500/20 w-full sm:w-auto"
          onClick={goToNewApplication}
        >
          Đơn đăng ký mới
        </Button>
      </motion.div>

      {loading ? (
        <ApplicationListSkeleton />
      ) : error ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="rounded-3xl border border-red-100/90 bg-red-50/30 backdrop-blur-[2px] shadow-sm">
            <div className="flex flex-col items-center gap-4 py-14 px-4">
              <XCircle size={44} className="text-red-400" />
              <Text className="text-gray-600 text-center max-w-md">{error}</Text>
              <Button
                type="primary"
                icon={<RefreshCw size={15} />}
                className="!rounded-2xl !bg-orange-500 !border-orange-500"
                onClick={() => reload()}
              >
                Thử lại
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : apps.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="rounded-3xl border border-gray-100/90 bg-white/80 shadow-sm">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text className="text-gray-400 text-sm">
                  Bạn chưa có đơn đăng ký nào.
                </Text>
              }
              className="py-14"
            >
              <Button
                type="primary"
                className="!rounded-2xl !bg-orange-500 !border-orange-500 shadow-sm"
                onClick={goToNewApplication}
              >
                Tạo đơn đăng ký đầu tiên
              </Button>
            </Empty>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mb-16 flex flex-col gap-4 pb-10 sm:mb-20 sm:pb-14"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.08 }}
          >
            <ApplicationListFilters
              searchText={searchText}
              onSearchTextChange={setSearchText}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              programFilter={programFilter}
              onProgramFilterChange={setProgramFilter}
              campusFilter={campusFilter}
              onCampusFilterChange={setCampusFilter}
              admissionFilter={admissionFilter}
              onAdmissionFilterChange={setAdmissionFilter}
              statusOptions={statusOptions}
              programOptions={programOptions}
              campusOptions={campusOptions}
              admissionOptions={admissionOptions}
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
            />
          </motion.div>

          <ApplicationListTableSection
            apps={apps}
            sortedFilteredApps={sortedFilteredApps}
            hasActiveFilters={hasActiveFilters}
            columns={applicationColumns}
            submittingId={submittingId}
            onSubmit={handleSubmitFinal}
            onView={goToApplicationDetail}
            onClearFilters={clearFilters}
            onTableChange={handleTableChange}
          />
        </motion.div>
      )}
    </ApplicantLayout>
  );
}
