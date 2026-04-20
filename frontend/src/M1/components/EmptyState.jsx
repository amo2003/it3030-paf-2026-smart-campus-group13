import React from "react";

function EmptyState({ title, message, onReset }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-3xl">
        📁
      </div>

      <h3 className="mt-5 text-2xl font-semibold text-slate-900">{title}</h3>

      <p className="mx-auto mt-3 max-w-xl text-slate-600">{message}</p>

      {onReset && (
        <button
          onClick={onReset}
          className="mt-6 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}

export default EmptyState;