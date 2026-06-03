import { useEffect, useRef, useState } from "react";
import { Button, Modal, Progress, Typography } from "antd";
import { XCircle } from "lucide-react";
import {
  formatVnd,
  QR_TIMEOUT_SEC,
} from "../utils/applicationListFormatters";

const { Text } = Typography;

type QrPaymentModalProps = {
  open: boolean;
  url: string;
  transactionId: string;
  amount: number | null;
  onPaid: () => void;
  onClose: () => void;
  onExpire: () => void;
};

/**
 * Modal thanh toán QR — countdown 5 phút, đổi màu theo thời gian còn lại và tự đóng khi hết hạn.
 */
export function QrPaymentModal({
  open,
  url,
  transactionId,
  amount,
  onPaid,
  onClose,
  onExpire,
}: QrPaymentModalProps) {
  const [remaining, setRemaining] = useState(QR_TIMEOUT_SEC);
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!open) return;
    const startMs = Date.now();
    const id = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startMs) / 1000);
      const r = Math.max(0, QR_TIMEOUT_SEC - elapsed);
      setRemaining(r);
      if (r === 0) {
        clearInterval(id);
        setTimeout(() => onExpireRef.current(), 0);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [open]);

  const expired = remaining === 0;
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const percent = Math.round((remaining / QR_TIMEOUT_SEC) * 100);
  const timerColor =
    remaining > 120 ? "#22c55e" : remaining > 60 ? "#f97316" : "#ef4444";

  return (
    <Modal
      open={open}
      title="Thanh toán bằng QR"
      width={440}
      getContainer={() => document.body}
      zIndex={2000}
      centered
      className="[&_.ant-modal-content]:!rounded-3xl"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose} className="!rounded-xl">
          Đóng
        </Button>,
        <Button
          key="paid"
          type="primary"
          disabled={expired}
          className="!rounded-xl !bg-green-600 !border-green-600 disabled:!opacity-50"
          onClick={onPaid}
        >
          Đã thanh toán
        </Button>,
      ]}
    >
      <div className="flex flex-col items-center gap-4 pt-1">
        <div className="flex flex-col items-center gap-1">
          <Progress
            type="circle"
            percent={percent}
            size={76}
            strokeColor={timerColor}
            trailColor="#f3f4f6"
            strokeWidth={8}
            format={() => (
              <span
                className="text-[15px] font-bold tabular-nums leading-none"
                style={{ color: timerColor }}
              >
                {mm}:{ss}
              </span>
            )}
          />
          <Text className="!text-[11px] !text-gray-400">
            {expired ? "Mã QR đã hết hạn" : "Thời gian còn lại"}
          </Text>
        </div>

        {expired ? (
          <div className="w-[220px] h-[220px] flex flex-col items-center justify-center gap-3 rounded-2xl bg-red-50 border border-red-100">
            <XCircle size={44} className="text-red-400" />
            <Text className="!text-sm !text-red-500 text-center leading-snug">
              Phiên thanh toán đã hết hạn.
              <br />
              Vui lòng nộp đơn lại để nhận mã mới.
            </Text>
          </div>
        ) : (
          <img
            src={url}
            alt="QR thanh toán"
            className="rounded-xl border border-gray-100 shadow-sm"
            style={{ width: 220, height: 220, objectFit: "contain" }}
          />
        )}

        <div className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex flex-col gap-2">
          <div>
            <div className="text-[11px] text-gray-500 mb-0.5">
              Số tiền cần thanh toán
            </div>
            <div className="text-base font-semibold text-orange-600">
              {amount !== null ? formatVnd(amount) : "Không xác định"}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-gray-500 mb-0.5">Mã giao dịch</div>
            <div className="font-mono text-sm text-gray-700 break-all">
              {transactionId}
            </div>
          </div>
        </div>

        {!expired && (
          <Text className="!text-xs !text-gray-400 text-center">
            Sau khi quét QR và thanh toán thành công, nhấn{" "}
            <strong className="text-green-700">Đã thanh toán</strong>.<br />
            Hệ thống sẽ cập nhật trạng thái đơn đăng ký của bạn.
          </Text>
        )}
      </div>
    </Modal>
  );
}
