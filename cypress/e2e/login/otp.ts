import { TOTP } from "otpauth";

let totp: TOTP;

export const extractOTPSecret = (qrCodeLink: string) => {
  return qrCodeLink.split("secret=")[1]?.split("&")[0];
};

export const generateOTP = (otp?: string) => {
  if (otp) {
    totp = new TOTP({
      secret: otp,
      period: 30,
    });
  }

  if (!totp) {
    throw new Error("No token provider, secret has not been provided.");
  }

  return totp.generate();
};

/**
 * Returns the number of milliseconds to wait so that the next
 * generateOTP() call lands near the start of a fresh TOTP period.
 * This avoids token expiration during submission and prevents replay.
 */
export const getMsUntilNextPeriod = () => {
  const nowSeconds = Math.floor(Date.now() / 1000);
  const elapsedInPeriod = nowSeconds % totp.period;
  if (elapsedInPeriod < 2) {
    return 500;
  }
  const remainingInPeriod = totp.period - elapsedInPeriod;
  return remainingInPeriod * 1000 + 500;
};
