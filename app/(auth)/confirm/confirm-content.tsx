"use client";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth";
import AuthShell from "../auth-shell";

const RESEND_COOLDOWN = 60;

export function ConfirmOTPContent() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);
  const { verifyOtp, resendOtp } = useAuth();
  const router = useRouter();
  const id = useId();

  const query = useSearchParams();
  const email = decodeURIComponent(query.get("email") || "");

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const onSubmit = async () => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      const res = await verifyOtp(email, otp);
      toast.success(
        res.message || "OTP confirmed successfully! Login to continue",
      );
      router.push(`/login?email=${encodeURIComponent(email)}&verified=true`);
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
        setOtp("");
        return;
      }
      setServerError("Failed to confirm OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onResend = async () => {
    if (cooldown > 0 || resending || !email) return;
    setResending(true);
    try {
      const res = await resendOtp(email);
      toast.success(res.message || "A new code is on its way.");
      setCooldown(RESEND_COOLDOWN);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Couldn't resend the code. Try again shortly.",
      );
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Check your inbox"
      headline="One code, then the paper."
      blurb="Verifying the address keeps your results attached to the right account."
    >
      <p className="eyebrow text-marker-ink">Verification</p>
      <h1 className="mt-2 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-ink">
        Enter the six-digit code
      </h1>
      {email && (
        <p className="mt-1.5 text-[0.8125rem] leading-6 text-ink-quiet">
          Sent to{" "}
          <span className="font-semibold text-ink-soft">{email}</span>
        </p>
      )}

      <form
        className="mt-6"
        noValidate
        aria-label="Confirm OTP form"
        onSubmit={(event) => {
          event.preventDefault();
          void onSubmit();
        }}
      >
        <label
          htmlFor={id}
          className="mb-2 block text-[0.8125rem] font-semibold text-ink-soft"
        >
          Code
        </label>

        <InputOTP
          id={id}
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otp}
          onChange={setOtp}
          aria-label="Six-digit verification code"
          containerClassName="justify-start"
        >
          <InputOTPGroup className="gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="h-12 w-9 rounded-xl border border-rule bg-sheet text-[1.0625rem] font-semibold text-ink shadow-none sm:w-11"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {serverError && (
          <p
            role="alert"
            className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[0.75rem] leading-5 text-rose-700"
          >
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          className="mt-5 h-11 w-full rounded-xl text-[0.8125rem] font-semibold"
          disabled={isSubmitting || otp.length < 6}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2
                className="mr-2 animate-spin"
                size={15}
                aria-hidden="true"
              />
              <span>Confirming…</span>
            </>
          ) : (
            "Confirm email"
          )}
        </Button>

        <div className="mt-4 border-t border-rule pt-4 text-[0.75rem] text-ink-quiet">
          {cooldown > 0 ? (
            <span className="tabular-nums">
              You can request another code in {Math.floor(cooldown / 60)}:
              {String(cooldown % 60).padStart(2, "0")}
            </span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={resending}
              className="font-semibold text-marker-ink underline decoration-marker-line underline-offset-4 transition-colors hover:decoration-marker disabled:opacity-50"
            >
              {resending ? "Resending…" : "Send another code"}
            </button>
          )}
        </div>
      </form>
    </AuthShell>
  );
}
