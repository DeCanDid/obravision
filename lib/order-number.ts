const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no look-alike characters

// Example: OBV-261019-K7Q2M
export function generateOrderNumber() {
  const d = new Date();
  const ymd =
    String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  let rand = "";
  for (let i = 0; i < 5; i++) rand += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return `OBV-${ymd}-${rand}`;
}