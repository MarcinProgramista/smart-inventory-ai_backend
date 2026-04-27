export function validateSupplierDefault(data) {
  const errors = [];

  const { name, contact, email, street, phone, postal_code, city, country } =
    data;

  if (!name || name.length < 2) {
    errors.push("Supplier name must have at least 2 characters");
  }
  if (!phone) {
    errors.push("Phone is required");
  }
  if (!email) {
    errors.push("Email is required");
  }
  if (!street) {
    errors.push("Street is required");
  }
  if (!city) {
    errors.push("City is required");
  }
  if (!contact) {
    errors.push("Contact is required");
  }
  if (!country || country.length !== 2) {
    errors.push("Invalid country code (use ISO2 like 'PL'");
  }
  if (postal_code && postal_code.length > 20) {
    errors.push("Postal code too long");
  }

  return errors;
}
