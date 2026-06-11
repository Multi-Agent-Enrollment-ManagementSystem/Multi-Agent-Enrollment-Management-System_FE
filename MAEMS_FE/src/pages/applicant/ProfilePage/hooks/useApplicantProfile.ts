import { useEffect, useState } from "react";
import { Form, message } from "antd";
import dayjs from "dayjs";
import { extractApiError } from "@/utils/apiError";
import type { UserProfile } from "@/types/auth";
import type {
  CreateApplicantRequest,
  CreateApplicantResponse,
} from "@/types/applicant";
import {
  createApplicant,
  getMyApplicant,
  getProfile,
  patchApplicant,
} from "../api/applicantProfileApi";
import type { ApplicantFormValues } from "../types";

/** Hook quản lý tải dữ liệu hồ sơ tài khoản/thí sinh và luồng tạo/sửa form. */
export function useApplicantProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [applicant, setApplicant] = useState<CreateApplicantResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm<ApplicantFormValues>();
  const [messageApi, contextHolder] = message.useMessage();

  // Khởi tải song song thông tin tài khoản và hồ sơ thí sinh khi mount trang.
  useEffect(() => {
    Promise.all([
      getProfile().catch(() => null),
      getMyApplicant().catch(() => null),
    ]).then(([profileData, applicantData]) => {
      setProfile(profileData);
      setApplicant(applicantData);
      setLoading(false);
    });
  }, []);

  /** Điền form từ dữ liệu hồ sơ hiện có khi bắt đầu chỉnh sửa. */
  function handleStartEdit() {
    if (!applicant) return;
    form.setFieldsValue({
      fullName: applicant.fullName,
      gender: applicant.gender,
      dateOfBirth: dayjs(applicant.dateOfBirth),
      highSchoolName: applicant.highSchoolName,
      highSchoolDistrict: applicant.highSchoolDistrict,
      highSchoolProvince: applicant.highSchoolProvince,
      graduationYear: applicant.graduationYear,
      idIssueNumber: applicant.idIssueNumber,
      idIssueDate: dayjs(applicant.idIssueDate),
      idIssuePlace: applicant.idIssuePlace,
      contactName: applicant.contactName,
      contactPhone: applicant.contactPhone,
      contactEmail: applicant.contactEmail,
      contactAddress: applicant.contactAddress,
    });
    setIsEditing(true);
  }

  /** Gửi form tạo mới hoặc cập nhật hồ sơ thí sinh. */
  async function handleSubmit(values: ApplicantFormValues) {
    setSubmitting(true);
    try {
      const payload: CreateApplicantRequest = {
        ...values,
        dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
        idIssueDate: values.idIssueDate.format("YYYY-MM-DD"),
        allowShare: true,
      };
      if (isEditing && applicant) {
        const response = await patchApplicant(payload);
        setApplicant(response);
        setIsEditing(false);
        messageApi.success("Hồ sơ thí sinh đã được cập nhật!");
      } else {
        const response = await createApplicant(payload);
        setApplicant(response);
        messageApi.success("Hồ sơ thí sinh đã được tạo thành công!");
        form.resetFields();
      }
    } catch (err) {
      const prefix = isEditing
        ? "Cập nhật hồ sơ thất bại"
        : "Tạo hồ sơ thất bại";
      const detail = extractApiError(err);
      messageApi.error(`${prefix}: ${detail}`);
    } finally {
      setSubmitting(false);
    }
  }

  const initial = profile?.username?.charAt(0).toUpperCase() ?? "U";

  return {
    profile,
    applicant,
    loading,
    submitting,
    isEditing,
    setIsEditing,
    form,
    messageApi,
    contextHolder,
    initial,
    handleStartEdit,
    handleSubmit,
  };
}
