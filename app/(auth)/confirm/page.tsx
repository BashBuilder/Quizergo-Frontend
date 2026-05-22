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
import { useId, useState } from "react";
import axios from "@/config/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const router = useRouter();
  const id = useId();

  const query = useSearchParams();

  const onSubmit = async () => {
    setServerError(null);
    setIsSubmitting(true);
    console.log("Submitting OTP:", otp);
    try {
      const email = decodeURIComponent(query.get("email") || "");
      console.log("Sending OTP confirmation request for email:", email);
      const res = await axios.post("/auth/verify", { otp, email });
      toast.success(
        res.data.message || "OTP confirmed successfully! Login to continue",
      );
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Failed to confirm OTP. Please try again.";
        setServerError(message);
        return;
      }
      setServerError("Failed to confirm OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          {/* Login form */}
          <Card className="backdrop-blur-sm bg-slate-950/5 max-w-sm w-full mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-white">
                Confirm OTP
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form
                className="flex flex-col items-center gap-6 "
                noValidate
                aria-label="Login form"
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
                  disabled={isSubmitting}
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
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
