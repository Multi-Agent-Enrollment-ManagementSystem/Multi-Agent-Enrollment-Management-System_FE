import { XCircle } from "lucide-react";
import { Form, Input, Modal } from "antd";
import type { FormInstance } from "antd";

type OfficerRejectModalProps = {
  open: boolean;
  form: FormInstance;
  confirmLoading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

/** Modal từ chối hồ sơ ngay trên danh sách (không cần vào chi tiết). */
export function OfficerRejectModal({
  open,
  applicationId,
  form,
  confirmLoading,
  onCancel,
  onSubmit,
}: OfficerRejectModalProps) {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-red-600">
          <XCircle size={18} />
          Từ chối hồ sơ
        </div>
      }
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      okText="Xác nhận từ chối"
      okButtonProps={{ danger: true }}
      cancelText="Huỷ"
      confirmLoading={confirmLoading}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="reason"
          label="Lý do từ chối"
          rules={[{ required: true, message: "Vui lòng nhập lý do từ chối" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập lý do từ chối hồ sơ này..."
            className="!rounded-xl"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
