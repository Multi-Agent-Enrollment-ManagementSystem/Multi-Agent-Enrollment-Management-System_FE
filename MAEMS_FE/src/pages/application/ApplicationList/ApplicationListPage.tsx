import { Button, Card, Empty, Spin, Typography } from "antd";
import { PlusCircle, XCircle } from "lucide-react";
import { ApplicantLayout } from "@/layouts/ApplicantLayout";
import { ApplicantMenu } from "@/pages/applicant/ApplicantMenu";
import {
  ApplicationListFilters,
  ApplicationListTableSection,
  QrPaymentModal,
} from "./components";
import { useApplicationList } from "./hooks";

const { Title, Text } = Typography;

/** Trang danh sách đơn đăng ký của ứng viên — ghép layout và các section UI. */
export function ApplicationList() {
  const {
    notifContextHolder,
    qrModal,
    handleQrPaid,
    handleQrClose,
    handleQrExpire,
    loading,
    error,
    apps,
    filteredApps,
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
  } = useApplicationList();

  return (
    <ApplicantLayout menuItems={ApplicantMenu}>
      {notifContextHolder}

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

      <div className="flex items-start justify-between mb-5 sm:mb-6 flex-wrap gap-3">
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
          className="!rounded-xl !bg-orange-500 !border-orange-500 hover:!bg-orange-600 w-full sm:w-auto"
          onClick={goToNewApplication}
        >
          Đơn đăng ký mới
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Card className="rounded-2xl border border-red-100 shadow-sm">
          <div className="flex flex-col items-center gap-3 py-12">
            <XCircle size={40} className="text-red-400" />
            <Text className="text-gray-500">{error}</Text>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        </Card>
      ) : apps.length === 0 ? (
        <Card className="rounded-2xl border border-gray-100 shadow-sm">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <Text className="text-gray-400 text-sm">
                Bạn chưa có đơn đăng ký nào.
              </Text>
            }
            className="py-12"
          >
            <Button
              type="primary"
              className="!rounded-xl !bg-orange-500 !border-orange-500"
              onClick={goToNewApplication}
            >
              Tạo đơn đăng ký đầu tiên
            </Button>
          </Empty>
        </Card>
      ) : (
        <div className="mb-16 flex flex-col gap-4 pb-10 sm:mb-20 sm:pb-14">
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

          <ApplicationListTableSection
            apps={apps}
            filteredApps={filteredApps}
            hasActiveFilters={hasActiveFilters}
            columns={applicationColumns}
            submittingId={submittingId}
            onSubmit={handleSubmitFinal}
            onView={goToApplicationDetail}
            onClearFilters={clearFilters}
          />
        </div>
      )}
    </ApplicantLayout>
  );
}
