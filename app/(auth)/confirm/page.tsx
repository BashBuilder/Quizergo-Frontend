import { Suspense } from "react";
import { ConfirmOTPContent } from "./confirm-content";

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-dvh items-center justify-center bg-exam"
          role="status"
        >
          <p className="eyebrow text-white/55">Checking your code…</p>
        </div>
      }
    >
      <ConfirmOTPContent />
    </Suspense>
  );
}
