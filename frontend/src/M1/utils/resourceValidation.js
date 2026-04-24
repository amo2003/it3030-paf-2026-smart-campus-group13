const RESOURCE_TYPES = ["LECTURE_HALL", "LAB", "MEETING_ROOM", "EQUIPMENT"];
const RESOURCE_STATUSES = ["ACTIVE", "OUT_OF_SERVICE", "UNDER_MAINTENANCE"];

export function validateResourceForm(values) {
  const errors = {};

  const resourceCode = values.resourceCode?.trim() || "";
  const name = values.name?.trim() || "";
  const location = values.location?.trim() || "";
  const description = values.description?.trim() || "";
  const availableFrom = values.availableFrom || "";
  const availableTo = values.availableTo || "";
  const status = values.status || "";
  const type = values.type || "";
  const capacity = values.capacity;

  if (!resourceCode) {
    errors.resourceCode = "Resource code is required";
  } else if (resourceCode.length < 3 || resourceCode.length > 20) {
    errors.resourceCode = "Resource code must be between 3 and 20 characters";
  } else if (!/^[A-Z0-9-]+$/.test(resourceCode)) {
    errors.resourceCode = "Use only uppercase letters, numbers, and hyphens";
  }

  if (!name) {
    errors.name = "Resource name is required";
  } else if (name.length < 3) {
    errors.name = "Resource name must be at least 3 characters";
  } else if (name.length > 100) {
    errors.name = "Resource name must not exceed 100 characters";
  }

  if (!type) {
    errors.type = "Resource type is required";
  } else if (!RESOURCE_TYPES.includes(type)) {
    errors.type = "Invalid resource type selected";
  }

  if (capacity === "" || capacity === null || capacity === undefined) {
    errors.capacity = "Capacity is required";
  } else if (Number.isNaN(Number(capacity))) {
    errors.capacity = "Capacity must be a number";
  } else if (Number(capacity) < 1) {
    errors.capacity = "Capacity must be at least 1";
  } else if (Number(capacity) > 1000) {
    errors.capacity = "Capacity must not exceed 1000";
  }

  if (!location) {
    errors.location = "Location is required";
  } else if (location.length < 3) {
    errors.location = "Location must be at least 3 characters";
  } else if (location.length > 120) {
    errors.location = "Location must not exceed 120 characters";
  }

  if (!status) {
    errors.status = "Status is required";
  } else if (!RESOURCE_STATUSES.includes(status)) {
    errors.status = "Invalid status selected";
  }

  if (description && description.length > 500) {
    errors.description = "Description must not exceed 500 characters";
  }

  if ((availableFrom && !availableTo) || (!availableFrom && availableTo)) {
    errors.availableTime = "Both available from and available to must be filled";
  }

  if (availableFrom && availableTo && availableFrom >= availableTo) {
    errors.availableTime = "Available from time must be earlier than available to time";
  }

  if (status === "OUT_OF_SERVICE") {
    if (!values.outOfServiceUntil) {
      errors.outOfServiceUntil = "Out of service until date/time is required";
    } else {
      const selectedDate = new Date(values.outOfServiceUntil);
      const now = new Date();

      if (selectedDate <= now) {
        errors.outOfServiceUntil = "Out of service until must be a future date/time";
      }
    }
  }

  return errors;
}