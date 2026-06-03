export function validateSupplier(data, options = {}) {
  const errors = [];

  const { isUpdate = false } = options;

  const { name, contact_id, postal_code, city, country } = data;

  // name
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Supplier name must have at least 2 characters");
  }

  // city
  if (!city || typeof city !== "string" || city.trim().length < 2) {
    errors.push("City must have at least 2 characters");
  }

  // country
  if (!country || typeof country !== "string" || country.trim().length !== 2) {
    errors.push("Invalid country code (use ISO like `PL`)");
  }

  // postal code
  const postalRegex = /^\d{2}-\d{3}$/;

  if (!postal_code || !postalRegex.test(postal_code.trim())) {
    errors.push("Postal code must have format 00-000");
  }

  // contact_id
  if (
    contact_id !== undefined &&
    contact_id !== null &&
    contact_id !== "" &&
    isNaN(Number(contact_id))
  ) {
    errors.push("Invalid contact_id");
  }

  return errors;
}
