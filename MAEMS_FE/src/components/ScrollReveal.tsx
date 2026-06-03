import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Độ trễ bổ sung (giây) — dùng stagger theo thứ tự phần tử trong danh sách */
  delay?: number;
  /** Dịch nhẹ theo trục Y khi xuất hiện */
  offsetY?: number;
  /** Fade kèm blur nhẹ rồi rõ dần — giống landing page chuyên nghiệp */
  blur?: boolean;
  /** Chỉ kích hoạt animation một lần khi cuộn vào viewport */
  once?: boolean;
  /** Phần trăm phần tử hiện trước khi bắt đầu animate (0–1) */
  amount?: number;
  /** Animate ngay khi mount (hero) thay vì chờ scroll */
  immediate?: boolean;
};

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Bọc nội dung với fade + blur nhẹ → rõ, có thể kích hoạt khi mount hoặc khi scroll vào view.
 * Tôn trọng prefers-reduced-motion để không gây khó chịu cho người dùng nhạy cảm chuyển động.
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  offsetY = 20,
  blur = true,
  once = true,
  amount = 0.2,
  immediate = false,
}: ScrollRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const hidden = {
    opacity: 0,
    y: offsetY,
    ...(blur ? { filter: "blur(6px)" as const } : {}),
  };

  const visible = {
    opacity: 1,
    y: 0,
    ...(blur ? { filter: "blur(0px)" as const } : {}),
  };

  const transition = {
    duration: 0.65,
    delay,
    ease: EASE_OUT,
  };

  if (immediate) {
    return (
      <motion.div
        className={className}
        initial={hidden}
        animate={visible}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={{ once, amount, margin: "0px 0px -72px 0px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
