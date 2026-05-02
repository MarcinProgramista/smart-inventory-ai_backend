export function normalizeCategoryPayload(data) {
  const toStr = (v) =>
    typeof v === "string" && v.trim() !== "" ? v.trim() : null;

  return {
    name: toStr(data.name),
  };
}
