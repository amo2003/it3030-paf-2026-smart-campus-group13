import React, { useEffect, useMemo, useState } from "react";
import { validateResourceForm } from "../utils/resourceValidation";

const initialFormData = {
  resourceCode: "",
  name: "",
  type: "",
  capacity: "",
  location: "",
  availableFrom: "",
  availableTo: "",
  status: "ACTIVE",
  description: "",
  outOfServiceUntil: "",
};

function toTimeInputValue(value) {
  if (!value) return "";
  return value.slice(0, 5);
}

function ResourceForm({ selectedResource, onSubmit, onCancel, submitting }) {
  const [formData, setFormData] = useState(initialFormData);
  const [touched, setTouched] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    if (selectedResource) {
      setFormData({
        resourceCode: selectedResource.resourceCode || "",
        name: selectedResource.name || "",
        type: selectedResource.type || "",
        capacity: selectedResource.capacity ?? "",
        location: selectedResource.location || "",
        availableFrom: toTimeInputValue(selectedResource.availableFrom),
        availableTo: toTimeInputValue(selectedResource.availableTo),
        status: selectedResource.status || "ACTIVE",
        description: selectedResource.description || "",
        outOfServiceUntil: selectedResource.outOfServiceUntil
          ? selectedResource.outOfServiceUntil.slice(0, 16)
          : "",
      });
    } else {
      setFormData(initialFormData);
    }

    setTouched({});
    setSubmitAttempted(false);
  }, [selectedResource]);

  const errors = useMemo(() => validateResourceForm(formData), [formData]);

  const showError = (field) => touched[field] || submitAttempted;

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updatedValue =
      name === "resourceCode" ? value.toUpperCase().replace(/\s+/g, "") : value;

    const updatedForm = {
      ...formData,
      [name]: updatedValue,
    };

    if (name === "status" && value !== "OUT_OF_SERVICE") {
      updatedForm.outOfServiceUntil = "";
    }

    setFormData(updatedForm);
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({
      ...prev,
      [e.target.name]: true,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = {
      resourceCode: formData.resourceCode.trim(),
      name: formData.name.trim(),
      type: formData.type,
      capacity: Number(formData.capacity),
      location: formData.location.trim(),
      availableFrom: formData.availableFrom || null,
      availableTo: formData.availableTo || null,
      status: formData.status,
      description: formData.description.trim(),
      outOfServiceUntil:
        formData.status === "OUT_OF_SERVICE" && formData.outOfServiceUntil
          ? formData.outOfServiceUntil
          : null,
    };

    await onSubmit(payload);
  };

  const isEditMode = !!selectedResource;

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">
          {isEditMode ? "Update Resource" : "Add New Resource"}
        </h2>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-200 bg-slate-100 px-5 py-2.5 font-semibold text-slate-800 transition hover:bg-slate-200"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Resource Code
            </label>
            <input
              type="text"
              name="resourceCode"
              value={formData.resourceCode}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="MR-101"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            {showError("resourceCode") && errors.resourceCode && (
              <p className="mt-1.5 text-sm text-rose-600">{errors.resourceCode}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Resource Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Conference Room 1"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            {showError("name") && errors.name && (
              <p className="mt-1.5 text-sm text-rose-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Select Type</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
            {showError("type") && errors.type && (
              <p className="mt-1.5 text-sm text-rose-600">{errors.type}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="20"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            {showError("capacity") && errors.capacity && (
              <p className="mt-1.5 text-sm text-rose-600">{errors.capacity}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Admin Block - Floor 1"
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            {showError("location") && errors.location && (
              <p className="mt-1.5 text-sm text-rose-600">{errors.location}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="ACTIVE">Active</option>
              <option value="OUT_OF_SERVICE">Out Of Service</option>
              <option value="UNDER_MAINTENANCE">Under Maintenance</option>
            </select>
            {showError("status") && errors.status && (
              <p className="mt-1.5 text-sm text-rose-600">{errors.status}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Available From
            </label>
            <input
              type="time"
              name="availableFrom"
              value={formData.availableFrom}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Available To
            </label>
            <input
              type="time"
              name="availableTo"
              value={formData.availableTo}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {formData.status === "OUT_OF_SERVICE" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Out Of Service Until
              </label>
              <input
                type="datetime-local"
                name="outOfServiceUntil"
                value={formData.outOfServiceUntil}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
              {showError("outOfServiceUntil") && errors.outOfServiceUntil && (
                <p className="mt-1.5 text-sm text-rose-600">
                  {errors.outOfServiceUntil}
                </p>
              )}
            </div>
          )}
        </div>

        {(showError("availableFrom") || showError("availableTo") || submitAttempted) &&
          errors.availableTime && (
            <p className="text-sm text-rose-600">{errors.availableTime}</p>
          )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            rows="4"
            placeholder="Description"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          {showError("description") && errors.description && (
            <p className="mt-1.5 text-sm text-rose-600">{errors.description}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
          >
            {submitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Resource"
              : "Create Resource"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-slate-200 bg-slate-100 px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-200"
          >
            Clear / Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default ResourceForm;