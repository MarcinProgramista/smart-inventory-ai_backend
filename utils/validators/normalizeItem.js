export function normalizeItem(data) {
  return {
    category_id:
      data.category_id !== undefined && data.category_id !== ""
        ? Number(data.category_id)
        : null,
    name: typeof data.name === "string" ? data.name.trim() : "",

    quantity:
      data.quantity !== undefined && data.quantity !== ""
        ? Number(data.quantity)
        : undefined,
    min_quantity:
      data.min_quantity !== undefined && data.min_quantity !== ""
        ? Number(data.min_quantity)
        : undefined,
    supplier_id:
      data.supplier_id !== undefined && data.supplier_id !== ""
        ? Number(data.supplier_id)
        : undefined,
    price:
      data.price !== undefined && data.price !== ""
        ? Number(data.price)
        : undefined,
    description:
      typeof data.description === "string" && data.description.trim() !== ""
        ? data.description.trim()
        : null,
  };
}
