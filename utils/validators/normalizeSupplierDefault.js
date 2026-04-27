import { normalizePhone } from "../validators/normalizePhone.js";
export function normalizeSupplierPayload(data) {
  const toStr = (v) =>
    typeof v === "string" && v.trim() !== "" ? v.trim() : null;
  const country = toStr(data.country) || "PL";
  return {
    name: toStr(data.name),
    contact: toStr(data.contact),
    email: toStr(data.email),
    phone: normalizePhone(data.phone, country),
    street: toStr(data.street),
    postal_code: toStr(data.postal_code),
    city: toStr(data.city),
    country,
  };
}
