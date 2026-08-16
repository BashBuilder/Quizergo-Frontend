"use client";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/auth";

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
    <main className="relative h-dvh overflow-hidden bg-slate-950 text-slate-100">
      <Image
        width={1920}
        height={1080}
        alt=""
        role="presentation"
        src="/assets/120493 (1).jpg"
        priority
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center px-6 py-12">
        <div className="grid w-full">
          {/* OTP form */}
          <Card className="backdrop-blur-sm bg-slate-950/5 max-w-sm w-full mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-white">
                Confirm OTP
              </CardTitle>
              {email && (
                <p className="text-center text-sm text-slate-400 mt-1">
                  Enter the 6-digit code sent to{" "}
                  <span className="text-slate-200 font-medium">{email}</span>
                </p>
              )}
            </CardHeader>

            <CardContent>
              <form
                className="flex flex-col items-center gap-6 "
                noValidate
                aria-label="Confirm OTP form"
              >
                <InputOTP
                  id={id}
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otp}
                  onChange={setOtp}
                  className="text-white"
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="text-white mx-1 rounded-md border  "
                    />
                    <InputOTPSlot
                      index={1}
                      className="text-white mx-1 rounded-md border  "
                    />
                    <InputOTPSlot
                      index={2}
                      className="text-white mx-1 rounded-md border  "
                    />
                    <InputOTPSlot
                      index={3}
                      className="text-white mx-1 rounded-md border  "
                    />
                    <InputOTPSlot
                      index={4}
                      className="text-white mx-1 rounded-md border  "
                    />
                    <InputOTPSlot
                      index={5}
                      className="text-white mx-1 rounded-md border  "
                    />
                  </InputOTPGroup>
                </InputOTP>
                {serverError && (
                  <p
                    role="alert"
                    className="rounded-3xl bg-red-500/10 text-center px-4 py-2 text-sm text-red-200 ring-1 ring-red-400/20"
                  >
                    {serverError}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full rounded-3xl py-5 text-sm font-semibold"
                  disabled={isSubmitting || otp.length < 6}
                  aria-busy={isSubmitting}
                  onClick={onSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2
                        className="animate-spin mr-2"
                        size={16}
                        aria-hidden="true"
                      />
                      <span>Submitting ...</span>
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>

                <div className="text-sm text-slate-400">
                  {cooldown > 0 ? (
                    <span>
                      Resend code in {Math.floor(cooldown / 60)}:
                      {String(cooldown % 60).padStart(2, "0")}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={onResend}
                      disabled={resending}
                      className="font-semibold text-orange-400 hover:underline disabled:opacity-50"
                    >
                      {resending ? "Resending..." : "Resend code"}
                    </button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
