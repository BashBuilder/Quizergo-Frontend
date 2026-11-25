import { Suspense } from "react";
import { LoginContent } from "./login-content";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-dvh items-center justify-center bg-exam"
          role="status"
        >
          <p className="eyebrow text-white/55">Opening your account…</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
