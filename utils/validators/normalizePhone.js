export function normalizePhone(phone, country = "PL") {
  if (!phone) return null;

  // 1. usuń wszystko poza cyframi
  const digits = phone.replace(/\D/g, "");

  // 2. walidacja – tylko 9 cyfr
  if (!/^\d{9}$/.test(digits)) {
    return null;
  }

  // 3. dodaj myślniki
  const formatted = digits.replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3");

  // 4. dodaj prefix jeśli PL
  if (country === "PL") {
    return `+48 ${formatted}`;
  }

  return formatted;
}
