export function capitalizeFirstLetter(str: string) {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function titleCase(str: string) {
  if (typeof str !== "string" || str.length === 0) {
    return str;
  }

  return str
    .split(" ")
    .map((word) => capitalizeFirstLetter(word))
    .join(" ");
}

export function currentTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
}

export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function formatNumberWithCommas(num: string | number): string {
  const numString = typeof num === "number" ? num.toString() : num;

  if (!/^-?\d*\.?\d*$/.test(numString)) {
    return numString;
  }

  const numWithoutCommas = numString.replace(/,/g, "");

  const parsedNum = parseFloat(numWithoutCommas);

  if (isNaN(parsedNum)) {
    return numString;
  }

  const formattedNumber = parsedNum.toLocaleString("en-US", {
    minimumFractionDigits: 2,
  });

  return formattedNumber;
}

export const statusCodes = {
  success: { code: 200, flag: "success", message: "Operation was successful" },
  already_exists: {
    code: 409,
    flag: "already_exists",
    message: "Resource already exists",
  },
  not_found: { code: 404, flag: "not_found", message: "Resource not found" },
  failed: { code: 500, flag: "failed", message: "Operation failed" },
};

export const productInternationalSizes = {
  Size: ["S", "M", "L", "XL", "XXL"],
  US: ["4", "6", "8/10", "12", "14"],
  EU: ["36", "38", "40/42", "44", "46"],
  UK: ["8", "10", "12/14", "16", "18"],
  NZ: ["8", "10", "12/14", "16", "18"],
  AU: ["8", "10", "12/14", "16", "18"],
  DE: ["36", "38", "40/42", "44", "46"],
  CA: ["4", "6", "8/10", "12", "14"],
  FR: ["36", "38", "40/42", "44", "46"],
  NL: ["36", "38", "40/42", "44", "46"],
  ES: ["36", "38", "40/42", "44", "46"],
  IT: ["40", "42", "44/46", "48", "50"],
  MX: ["4", "6", "8/10", "12", "14"],
  PT: ["36", "38", "40/42", "44", "46"],
  PL: ["36", "38", "40/42", "44", "46"],
  SE: ["36", "38", "40/42", "44", "46"],
  CH: ["36", "38", "40/42", "44", "46"],
  JP: ["S", "M", "L", "XL", "XXL"],
  KR: ["S", "M", "L", "XL", "XXL"],
  BR: ["S", "M", "L", "XL", "XXL"],
  Asian: ["L", "XL", "2XL/3XL", "4XL", "5XL"],
  ZA: ["66", "77", "88", "99", "110"],
  SA: ["P", "M", "L", "XL", "XXL"],
  BH: ["L", "XL", "2XL/3XL", "4XL", "5XL"],
  AE: ["32", "34", "36/38", "40", "42"],
  KW: ["S", "M", "L", "XL", "XXL"],
  QA: ["S", "M", "L", "XL", "XXL"],
  JO: ["S", "M", "L", "XL", "XXL"],
  OM: ["S", "M", "L", "XL", "XXL"],
};
