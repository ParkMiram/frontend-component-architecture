// utils/hashUtils.ts
import CryptoJS from "crypto-js";

export const hashSHA512 = (input: string): string => {
  return CryptoJS.SHA512(input).toString(CryptoJS.enc.Hex);
};
