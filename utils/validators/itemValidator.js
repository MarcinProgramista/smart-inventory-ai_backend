export function validateItem(data, options = {}) {
  const errors = [];
  const { isUpdate = false } = options;
  const {
    category_id,
    name,
    quantity,
    min_quantity,
    supplier_id,
    price,
    description,
  } = data;

  /**
   * name
   */
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      errors.push("Invalid item name ");
    }
  } else if (!isUpdate) {
    errors.push("Name is required");
  }
  /**
   * Quantity
   */
  if (quantity !== undefined) {
    if (!Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
      errors.push("Quantity must be a non-negative number");
    }
  } else if (!isUpdate) {
    errors.push("Quantity is required");
  }
  /**
   * min quantity
   */
  if (min_quantity !== undefined) {
    if (!Number.isInteger(Number(min_quantity)) || Number(min_quantity) < 0) {
      errors.push("Min quantity must be a non-negative number");
    }
  } else if (!isUpdate) {
    errors.push("Min quantity is required");
  }
  /**
   * price
   */
  if (price !== undefined) {
    if (isNaN(Number(price)) || Number(price) < 0) {
      errors.push("Price must be a non-negative number");
    }
  } else if (!isUpdate) {
    errors.push("Price is required");
  }
  /**
   * supplier id
   */
  if (supplier_id !== undefined) {
    if (!Number.isInteger(Number(supplier_id))) {
      errors.push("Invalid supplier_id");
    }
  } else if (!isUpdate) {
    errors.push("supplier_id is required");
  }
  /**
   * category id
   */
  if (category_id !== undefined && category_id !== null) {
    if (!Number.isInteger(Number(category_id))) {
      errors.push("Invalid category_id");
    }
  } else if (!isUpdate) {
    errors.push("category_id is required");
  }
  /**
   * description
   */
  if (description !== undefined && description !== null) {
    if (typeof description !== "string") {
      errors.push("Description must be a string");
    }
  }
  return errors;
}
