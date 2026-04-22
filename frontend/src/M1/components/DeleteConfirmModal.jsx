import React from "react";

function DeleteConfirmModal({ resource, onCancel, onConfirm, processing }) {
  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold">
            !
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-800">
              Delete Resource?
            </h2>
            <p className="text-slate-600 mt-2">
              You are about to delete{" "}
              <span className="font-semibold">{resource.name}</span> (
              {resource.resourceCode}). This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={onConfirm}
            disabled={processing}
            className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold"
          >
            {processing ? "Deleting..." : "Yes, Delete"}
          </button>

          <button
            onClick={onCancel}
            className="px-5 py-3 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;