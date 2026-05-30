export function validateContact(data, options = {}) {
  const errors = [];
  const { isUpdate = false } = options;
  const { user_id, first_name, last_name, role, mobile_phone, email } = data;

  /**
   * user_id (wymagany przy dodawaniu)
   */
  if (!isUpdate && !user_id) {
    errors.push("Missing user_id");
  }

  /**
   * first_name (wymagane)
   */
  if (
    !first_name ||
    typeof first_name !== "string" ||
    first_name.trim().length < 2
  ) {
    errors.push("First name must be at least 2 characters");
  }

  /**
   * last_name (opcjonalnie, ale jeśli podane - walidujemy)
   */
  if (last_name !== undefined && last_name !== null) {
    if (typeof last_name !== "string" || last_name.trim().length < 2) {
      errors.push("Last name must be at least 2 characters");
    }
  }

  /**
   * role
   */
  if (role !== undefined && role !== null) {
    if (typeof role !== "string" || role.trim().length < 2) {
      errors.push("Role must be at least 2 characters");
    }
  }

  /**
   * mobile_phone
   * walidacja : tylko cyfry , 9-15  znaków
   */
  if (
    mobile_phone !== undefined &&
    mobile_phone !== null &&
    String(mobile_phone).trim() !== ""
  ) {
    const phone = String(mobile_phone).trim();

    const phoneRegex = /^[0-9]{9,15}$/;

    if (!phoneRegex.test(phone)) {
      errors.push("Invalid phone number format (expected 9-15 digits)");
    }
  }

  /**
   * email
   * walidacja poprawnego formatu email
   */
  if (email !== undefined && email !== null) {
    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailTrimmed)) {
      errors.push("Invalid email format");
    }
  }
  return errors;
}
