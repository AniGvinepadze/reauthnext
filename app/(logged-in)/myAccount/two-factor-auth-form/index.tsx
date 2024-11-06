"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { QRCodeSVG } from "qrcode.react";
import { activate2fa, get2faSecret } from "./action";
import { useToast } from "@/hooks/use-toast";

type Props = {
  twoFactorActivated: boolean;
};

export default function TwoFactorAuthForm({ twoFactorActivated }: Props) {
  const [isActivated, setIsActivated] = useState(twoFactorActivated);
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const handleEnableClick = async () => {
    const response = await get2faSecret();

    if (response.error) {
      toast({
        variant: "destructive",
        title: response.message,
      });
      return;
    }
    setCode(response.twoFactorSecret ?? "");
    setStep(2);
  };
  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await activate2fa(otp);

    if (response?.error) {
      toast({
        variant: "destructive",
        title: response.message,
      });
      return;
    }

    toast({
      className: "bg-green-500 text-white",
      title: "Two-Factor has been enabled",
    });
    setIsActivated(true);
  };
  return (
    <div>
      {isActivated && <div>All done </div>}
      {!isActivated && (
        <div>
          {step === 1 && (
            <div>
              <Button onClick={handleEnableClick}>
                Enable Two-Factor Aauthentication
              </Button>
            </div>
          )}
          {step === 2 && (
            <div>
              <p>
                Scan the QR CODE below in the Google Authenticator aqq to
                activate Two-Factor Authetication
              </p>
              <QRCodeSVG value={code} />
              <Button
                onClick={() => setStep(3)}
                className="w-full my-2"
                variant="outline"
              >
                i have scanned the QR code
              </Button>
            </div>
          )}
          {step === 3 && (
            <form onSubmit={handleOTPSubmit}>
              <p>Enter one time passcode</p>
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button
                disabled={otp.length !== 6}
                type="submit"
                className="w-full my-2 mx-2"
              >
                Submit and Activate
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="w-full my-2 mx-2"
                variant="outline"
              >
                Cancel{" "}
              </Button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
