import React from "react";

function formatType(type) {
  if (!type) return "-";
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDateTime(value) {
  if (!value) return "-";
  return value.replace("T", " ");
}

function ResourceDetailsModal({ resource, onClose }) {
  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-blue-800 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Resource Details</h2>
            <p className="text-slate-200 mt-1">{resource.resourceCode}</p>
          </div>

          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Close
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-slate-700">
          <div>
            <p className="text-slate-500 mb-1">Resource Name</p>
            <p className="font-semibold text-slate-800">{resource.name}</p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Type</p>
            <p className="font-semibold text-slate-800">
              {formatType(resource.type)}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Capacity</p>
            <p className="font-semibold text-slate-800">{resource.capacity}</p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Location</p>
            <p className="font-semibold text-slate-800">{resource.location}</p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Available From</p>
            <p className="font-semibold text-slate-800">
              {resource.availableFrom || "-"}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Available To</p>
            <p className="font-semibold text-slate-800">
              {resource.availableTo || "-"}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Status</p>
            <p className="font-semibold text-slate-800">{resource.status}</p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Out Of Service Until</p>
            <p className="font-semibold text-slate-800">
              {formatDateTime(resource.outOfServiceUntil)}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-slate-500 mb-1">Description</p>
            <p className="font-semibold text-slate-800">
              {resource.description || "No description available"}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Created At</p>
            <p className="font-semibold text-slate-800">
              {formatDateTime(resource.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-slate-500 mb-1">Updated At</p>
            <p className="font-semibold text-slate-800">
              {formatDateTime(resource.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourceDetailsModal;