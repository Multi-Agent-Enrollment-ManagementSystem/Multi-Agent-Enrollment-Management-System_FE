import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";
import { AppFooter } from "../components/AppFooter";
import { AppHeader } from "../components/AppHeader";

const PAGE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Layout cố định cho trang public: header/footer không remount khi đổi route.
 * Nội dung trang render qua Outlet kèm transition fade nhẹ giữa các route.
 */
export function GuestLayout() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AppHeader />
      <main className="flex-1 -mt-[84px]">
        {reduceMotion ? (
          <Outlet />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.32, ease: PAGE_EASE }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <AppFooter />
    </div>
  );
}
