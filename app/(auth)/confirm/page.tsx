import { Suspense } from "react";
import { ConfirmOTPContent } from "./confirm-content";

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ConfirmOTPContent />
    </Suspense>
  );
}
