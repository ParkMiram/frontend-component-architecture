// 유효성 검사
export const isValidIp = (ip: string) => {
  const regex = /^[0-9.]+$/;

  if (!regex.test(ip)) return false;

  const parts = ip.split(".");

  if (parts.length !== 4) return false;

  return parts.every((p) => {
    const num = Number(p);

    return num >= 0 && num <= 255;
  });
};

// 문자로 변환
export const ipToNumber = (ip: string) => {
  const parts = ip.split(".").map(Number);

  return parts[0] * 256 ** 3 + parts[1] * 256 ** 2 + parts[2] * 256 + parts[3];
};

// 숫자로 변환
export const numberToIp = (num: number) => {
  return [
    Math.floor(num / 256 ** 3) % 256,
    Math.floor(num / 256 ** 2) % 256,
    Math.floor(num / 256) % 256,
    num % 256,
  ].join(".");
};

// 최대값
export const increaseIp = (ip: string, step: number) => {
  const base = ipToNumber(ip);
  const next = base + step;

  if (next > 4294967295) return null;

  return numberToIp(next);
};

// 입력 제한
export const allowIpInput = (value: string) => {
  return /^[0-9.]*$/.test(value);
};
