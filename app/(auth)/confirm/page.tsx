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
import Logo from "@/components/global/Logo";
import Image from "next/image";
import { useState } from "react";
import axios from "@/config/axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (formData) => {
    console.log(formData);
  };

  return (
    <main className="relative h-dvh overflow-hidden bg-slate-950 text-slate-100">
      {/* Decorative background — hidden from assistive tech */}
      <Image
        width={1920}
        height={1080}
        alt=""
        role="presentation"
        src="/assets/120493 (1).jpg"
        priority
        className="absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div className="absolute top-12 left-12 z-50 max-sm:top-4 max-sm:left-4">
        <Logo />
      </div>

      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-center px-6 py-12">
        <div className="grid w-full">
          {/* Login form */}
          <Card className="backdrop-blur-sm bg-slate-950/5 max-w-md w-full mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Confirm OTP</CardTitle>
            </CardHeader>

            <CardContent>
              <form className="space-y-6" noValidate aria-label="Login form">
                <InputOTP
                  id="digits-only"
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                {/* Server-side error */}
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
                  // disabled={isSubmitting}
                  // aria-busy={isSubmitting}
                >
                  {/* {isSubmitting ? (
                    <>
                      <Loader2
                        className="animate-spin mr-2"
                        size={16}
                        aria-hidden="true"
                      />
                      <span>Signing in…</span>
                    </>
                  ) : (
                    "Sign in" */}
                  {/* )} */}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
