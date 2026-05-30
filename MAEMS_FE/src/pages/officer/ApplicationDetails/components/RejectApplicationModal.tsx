import { Form, Input, Modal } from "antd";
import type { FormInstance } from "antd";
import { XCircle } from "lucide-react";

type RejectApplicationModalProps = {
  open: boolean;
  form: FormInstance;
  loading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

/** Modal nhập lý do từ chối hồ sơ */
export function RejectApplicationModal({
  open,
  form,
  loading,
  onCancel,
  onSubmit,
}: RejectApplicationModalProps) {
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
      okButtonProps={{ danger: true, loading }}
      cancelText="Huỷ"
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
