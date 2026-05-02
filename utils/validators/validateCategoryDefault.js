export function validateCategoryDefault(data) {
  const errors = [];

  const { name } = data;

  if (!name || name.length < 2) {
    errors.push("Category name must have at least 2 characters");
  }

  return errors;
}
