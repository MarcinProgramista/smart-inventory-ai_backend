export function validateSupplier(data, options = {}) {
  const errors = [];

  const { isUpdate = false } = options;

  const { name, contact_id, street, postal_code, city, country } = data;

  // name
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Supplier name must have at least 2 characters");
  }

  // city
  if (!city || typeof city !== "string" || !city.trim()) {
    errors.push("City is required");
  }

  // country
  if (!country || typeof country !== "string" || country.trim().length !== 2) {
    errors.push("Invalid country code (use ISO like `PL`)");
  }

  // postal code
  if (postal_code && postal_code.length > 20) {
    errors.push("Postal code too long");
  }

  // contact_id
  if (
    contact_id !== undefined &&
    contact_id !== null &&
    isNaN(Number(contact_id))
  ) {
    errors.push("Invalid contact_id");
  }

  return errors;
}
