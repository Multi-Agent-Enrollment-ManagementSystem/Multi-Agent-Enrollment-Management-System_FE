import { Navigate, Route, Routes } from "react-router-dom";
import { AdmissionPage } from "../features/admissions/pages/AdmissionPage";
import { AuthPage } from "../features/auth/page/AuthPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<AdmissionPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

