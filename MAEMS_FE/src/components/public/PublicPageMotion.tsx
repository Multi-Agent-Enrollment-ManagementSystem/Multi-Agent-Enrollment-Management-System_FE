import { type ReactNode } from "react";
import { ScrollReveal } from "../ScrollReveal";

type BaseProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Hero/banner đầu trang public — fade ngay sau transition route (không chờ scroll).
 */
export function PublicHeroReveal({
  children,
  className,
  delay = 0,
}: BaseProps) {
  return (
    <ScrollReveal immediate delay={delay} offsetY={16} className={className}>
      {children}
    </ScrollReveal>
  );
}

/**
 * Khối section — hiện dần khi người dùng scroll tới.
 */
export function PublicSectionReveal({
  children,
  className,
  delay = 0,
  amount = 0.15,
}: BaseProps & { amount?: number }) {
  return (
    <ScrollReveal delay={delay} amount={amount} className={className}>
      {children}
    </ScrollReveal>
  );
}

/**
 * Phần tử trong danh sách/lưới — stagger theo thứ tự index.
 */
export function PublicItemReveal({
  children,
  className,
  index = 0,
  stagger = 0.07,
}: BaseProps & { index?: number; stagger?: number }) {
  return (
    <ScrollReveal
      delay={index * stagger}
      amount={0.12}
      className={className}
    >
      {children}
    </ScrollReveal>
  );
}
