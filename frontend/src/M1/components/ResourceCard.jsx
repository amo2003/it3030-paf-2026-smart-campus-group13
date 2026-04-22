import React from "react";

function getStatusStyle(status) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    case "OUT_OF_SERVICE":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "UNDER_MAINTENANCE":
      return "bg-amber-50 text-amber-700 border border-amber-200";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
}

function formatType(type) {
  if (!type) return "-";
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function ResourceCard({
  resource,
  onViewDetails,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  return (
    <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-3xl font-semibold leading-tight text-slate-900">
            {resource.name}
          </h3>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {resource.resourceCode}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
            resource.status
          )}`}
        >
          {resource.status}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500">Type</p>
          <p className="mt-1 font-semibold text-slate-900">
            {formatType(resource.type)}
          </p>
        </div>

        <div>
          <p className="text-slate-500">Capacity</p>
          <p className="mt-1 font-semibold text-slate-900">{resource.capacity}</p>
        </div>

        <div>
          <p className="text-slate-500">Location</p>
          <p className="mt-1 font-semibold text-slate-900">{resource.location}</p>
        </div>

        <div>
          <p className="text-slate-500">Availability</p>
          <p className="mt-1 font-semibold text-slate-900">
            {resource.availableFrom || "-"} to {resource.availableTo || "-"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-slate-500 text-sm">Description</p>
        <p className="mt-1 text-sm leading-6 text-slate-800">
          {resource.description || "No description provided"}
        </p>
      </div>

      {resource.outOfServiceUntil && (
        <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          Out of service until {resource.outOfServiceUntil}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => onViewDetails(resource)}
          className="rounded-2xl border border-slate-200 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Details
        </button>

        <button
          onClick={() => onEdit(resource)}
          className="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(resource)}
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          Delete
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => onStatusChange(resource, "ACTIVE")}
          className="rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Mark Active
        </button>

        <button
          onClick={() => onStatusChange(resource, "OUT_OF_SERVICE")}
          className="rounded-2xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          Mark Out of Service
        </button>
      </div>
    </article>
  );
}

export default ResourceCard;