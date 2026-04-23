export function normalizeSupplierPayload(data) {
  const toStr = (v) =>
    typeof v === "string" && v.trim() !== "" ? v.trim() : null;

  return {
    name: toStr(data.name),
    contact: toStr(data.contact),
    email: toStr(data.email),
    phone: toStr(data.phone),
    street: toStr(data.street),
    postal_code: toStr(data.postal_code),
    city: toStr(data.city),
    country: toStr(data.country) || "PL",
  };
}
