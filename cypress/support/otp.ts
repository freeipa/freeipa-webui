import { TOTP } from "otpauth";

let totp: TOTP;

export const generateOTP = (secret?: string) => {
  if (secret) {
    totp = new TOTP({
      secret: secret,
    });
  }

  if (!totp) {
    throw new Error("No token provider, secret has not been provided.");
  }

  return totp.generate();
};
