import React from "react";

function StatCard({ title, value, accent }) {
  return (
    <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-white px-5 py-5 shadow-sm">
      <div className={`absolute left-0 top-0 h-1.5 w-full ${accent}`}></div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
        {value}
      </h3>
    </div>
  );
}

function ResourceStats({ stats, lastSyncedAt }) {
  if (!stats) return null;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">
          Resource Overview
        </h2>
        <span className="text-sm text-slate-500">
          {lastSyncedAt ? `Last synced ${lastSyncedAt}` : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Resources"
          value={stats.totalResources}
          accent="bg-slate-900"
        />
        <StatCard
          title="Active"
          value={stats.activeResources}
          accent="bg-emerald-500"
        />
        <StatCard
          title="Out of Service"
          value={stats.outOfServiceResources}
          accent="bg-rose-500"
        />
        <StatCard
          title="Maintenance"
          value={stats.underMaintenanceResources}
          accent="bg-amber-500"
        />
        <StatCard
          title="Total Capacity"
          value={stats.totalCapacity}
          accent="bg-blue-600"
        />
      </div>
    </section>
  );
}

export default ResourceStats;