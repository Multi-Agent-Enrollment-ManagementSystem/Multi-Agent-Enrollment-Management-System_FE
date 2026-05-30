import { Form, Input, Modal } from "antd";
import type { FormInstance } from "antd";
import { FilePlus2 } from "lucide-react";

type SupplementRequestModalProps = {
  open: boolean;
  form: FormInstance;
  loading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

/** Modal gửi yêu cầu bổ sung tài liệu cho thí sinh */
export function SupplementRequestModal({
  open,
  form,
  loading,
  onCancel,
  onSubmit,
}: SupplementRequestModalProps) {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2 text-amber-600">
          <FilePlus2 size={18} />
          Yêu cầu bổ sung tài liệu
        </div>
      }
      open={open}
      onCancel={onCancel}
      onOk={onSubmit}
      okText="Gửi yêu cầu"
      okButtonProps={{
        className: "!bg-amber-500 !border-amber-500",
        loading,
      }}
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="note"
          label="Nội dung yêu cầu"
          rules={[
            { required: true, message: "Vui lòng nhập nội dung yêu cầu" },
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Mô tả các tài liệu cần bổ sung..."
            className="!rounded-xl"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
