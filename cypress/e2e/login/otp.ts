import { TOTP } from "otpauth";

let totp: TOTP;

export const extractOTPSecret = (qrCodeLink: string) => {
  return qrCodeLink.split("secret=")[1]?.split("&")[0];
};

export const generateOTP = (otp?: string) => {
  if (otp) {
    totp = new TOTP({
      secret: otp,
      // Increase in case of flakiness
      period: 5,
    });
  }

  if (!totp) {
    throw new Error("No token provider, secret has not been provided.");
  }

  return totp.generate();
};

export const getTokenPeriodInMs = () => {
  return totp.period * 1000;
};
