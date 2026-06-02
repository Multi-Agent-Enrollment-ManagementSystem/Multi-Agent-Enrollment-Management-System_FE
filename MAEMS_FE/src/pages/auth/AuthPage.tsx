import {
  AuthCredentialsPanel,
  AuthPageLayout,
  ResetPasswordRequestView,
  ResetPasswordVerifyView,
} from "./components";
import { useAuthPage } from "./hooks";

/** Trang xác thực: ghép layout, điều phối view và ủy logic cho hook. */
export function AuthPage() {
  const auth = useAuthPage();

  return (
    <AuthPageLayout>
      <div className="max-w-md mx-auto mt-4 sm:mt-8 md:mt-12">
        <div className="rounded-2xl bg-white/50 backdrop-blur-sm border border-orange-200/30 shadow-[0_8px_40px_rgba(0,0,0,0.45)] p-5 sm:p-6 md:p-8 overflow-hidden">
          {auth.authView === "auth" && (
            <div key="auth" className={auth.animClass}>
              <AuthCredentialsPanel
                activeTab={auth.activeTab}
                onTabChange={auth.handleTabChange}
                loginForm={auth.loginForm}
                registerForm={auth.registerForm}
                loading={auth.loading}
                loginError={auth.loginError}
                registerError={auth.registerError}
                onLogin={auth.onLogin}
                onRegister={auth.onRegister}
                onForgotPassword={auth.openResetFlow}
              />
            </div>
          )}

          {auth.authView === "reset-request" && (
            <div key="reset-request" className={auth.animClass}>
              <ResetPasswordRequestView
                form={auth.resetRequestForm}
                loading={auth.resetLoading}
                error={auth.resetError}
                onSubmit={auth.onResetRequest}
                onBack={auth.resetPasswordState}
              />
            </div>
          )}

          {auth.authView === "reset-verify" && (
            <div key="reset-verify" className={auth.animClass}>
              <ResetPasswordVerifyView
                form={auth.resetVerifyForm}
                resetEmail={auth.resetEmail}
                loading={auth.resetLoading}
                isExpired={auth.isResetExpired}
                remainingSeconds={auth.remainingSeconds}
                verifyResult={auth.verifyResult}
                error={auth.resetError}
                onSubmit={auth.onResetVerify}
                onBack={auth.backToResetRequest}
                onResendOtp={auth.handleResendOtp}
                onGoToLogin={auth.resetPasswordState}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        .auth-forward {
          animation: authViewForward 0.28s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .auth-back {
          animation: authViewBack 0.28s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </AuthPageLayout>
  );
}
