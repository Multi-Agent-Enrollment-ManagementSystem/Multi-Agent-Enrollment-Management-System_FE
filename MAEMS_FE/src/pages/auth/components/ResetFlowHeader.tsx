import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Steps } from "antd";

type ResetFlowHeaderProps = {
  onBack: () => void;
  currentStep: 0 | 1;
};

/** Header chung (nút quay lại + Steps) cho flow quên mật khẩu. */
export function ResetFlowHeader({ onBack, currentStep }: ResetFlowHeaderProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3 mb-5">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={onBack}
        className="!text-slate-500 hover:!text-slate-700 !p-1 !h-auto flex-shrink-0"
      />
      <Steps
        size="small"
        current={currentStep}
        className="flex-1 [&_.ant-steps-item-title]:!text-xs sm:[&_.ant-steps-item-title]:!text-sm"
        items={[{ title: "Gửi OTP" }, { title: "Xác thực" }]}
      />
    </div>
  );
}
