// Turns 0903 083 2685 or +234 903 083 2685 into 2349030832685 for wa.me links
export function toWhatsAppNumber(input: string) {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return `234${digits.slice(1)}`;
  return digits;
}

export function isValidPhone(input: string) {
  const digits = input.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}