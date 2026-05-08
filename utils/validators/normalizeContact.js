import { da } from "date-fns/locale";

export function normalizeContactPayload(data) {
  const toStr = (v) =>
    typeof v === "string" && v.trim() !== "" ? v.trim() : null;
  return {
    user_id: data.user_id !== undefined ? Number(data.user_id) : undefinded,
    first_name:
      typeof data.first_name === "string" ? data.first_name.trim() : null,
    last_name: toStr(data.last_name),
    role: toStr(data.role),
    mobile_phone: toStr(data.mobile_phone),
    email: toStr(data.email),
  };
}
