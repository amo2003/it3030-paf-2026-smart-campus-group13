import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  createResource,
  deleteResource,
  getAllResources,
  getResourceStatistics,
  searchResources,
  updateResource,
  updateResourceStatus,
} from "../api/resourceApi";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import EmptyState from "../components/EmptyState";
import ResourceCard from "../components/ResourceCard";
import ResourceDetailsModal from "../components/ResourceDetailsModal";
import ResourceFilterBar from "../components/ResourceFilterBar";
import ResourceForm from "../components/ResourceForm";
import ResourceStats from "../components/ResourceStats";

function ResourceCatalogPage() {
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
    minCapacity: "",
    location: "",
    status: "",
  });
  const [selectedResource, setSelectedResource] = useState(null);
  const [detailsResource, setDetailsResource] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteProcessing, setDeleteProcessing] = useState(false);
  const [pageMessage, setPageMessage] = useState("");
  const [error, setError] = useState("");
  const [lastSyncedAt, setLastSyncedAt] = useState("");

  const hasActiveFilters = useMemo(() => {
    return Boolean(
      filters.keyword ||
        filters.type ||
        filters.minCapacity ||
        filters.location ||
        filters.status
    );
  }, [filters]);

  const setSyncTimeNow = () => {
    setLastSyncedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  };

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [resourceData, statsData] = await Promise.all([
        getAllResources(),
        getResourceStatistics(),
      ]);

      setResources(resourceData);
      setStats(statsData);
      setSyncTimeNow();
    } catch (err) {
      setError(err.message || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const statsData = await getResourceStatistics();
        setStats(statsData);

        if (!hasActiveFilters) {
          const resourceData = await getAllResources();
          setResources(resourceData);
        }

        setSyncTimeNow();
      } catch (err) {
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [hasActiveFilters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      setPageMessage("");

      const data = await searchResources(filters);
      setResources(data);
      setSyncTimeNow();
    } catch (err) {
      setError(err.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setFilters({
      keyword: "",
      type: "",
      minCapacity: "",
      location: "",
      status: "",
    });
    setPageMessage("");
    setError("");
    await loadInitialData();
  };

  const handleOpenCreate = () => {
    setSelectedResource(null);
    setShowForm(true);
    setPageMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (resource) => {
    setSelectedResource(resource);
    setShowForm(true);
    setPageMessage("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelForm = () => {
    setSelectedResource(null);
    setShowForm(false);
  };

  const handleSubmitForm = async (payload) => {
    try {
      setSubmitting(true);
      setError("");
      setPageMessage("");

      if (selectedResource) {
        await updateResource(selectedResource.id, payload);
        setPageMessage("Resource updated successfully.");
      } else {
        await createResource(payload);
        setPageMessage("Resource created successfully.");
      }

      setShowForm(false);
      setSelectedResource(null);
      await loadInitialData();
    } catch (err) {
      setError(err.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (resource) => {
    setDeleteTarget(resource);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteProcessing(true);
      setError("");
      setPageMessage("");

      await deleteResource(deleteTarget.id);
      setPageMessage("Resource deleted successfully.");
      setDeleteTarget(null);
      await loadInitialData();
    } catch (err) {
      setError(err.message || "Delete failed");
    } finally {
      setDeleteProcessing(false);
    }
  };

  const handleStatusChange = async (resource, status) => {
    try {
      setError("");
      setPageMessage("");

      let outOfServiceUntil = null;

      if (status === "OUT_OF_SERVICE") {
        const userInput = window.prompt(
          "Enter date/time in this format: YYYY-MM-DDTHH:mm\nExample: 2026-04-25T10:30"
        );

        if (!userInput) return;
        outOfServiceUntil = userInput;
      }

      await updateResourceStatus(resource.id, status, outOfServiceUntil);
      setPageMessage(`Resource status changed to ${status}.`);
      await loadInitialData();
    } catch (err) {
      setError(err.message || "Status update failed");
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <section className="mb-8 rounded-[32px] bg-gradient-to-r from-slate-950 via-slate-900 to-blue-800 px-8 py-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                Facilities & Assets Catalogue
              </h1>
              <p className="mt-3 text-lg text-slate-200">
                Smart Campus Operations Hub - Module 1
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleOpenCreate}
                className="rounded-2xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-slate-100"
              >
                + Add New Resource
              </button>

              <button
                onClick={loadInitialData}
                className="rounded-2xl border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/20"
              >
                Refresh
              </button>
            </div>
          </div>
        </section>

        {pageMessage && (
          <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
            {pageMessage}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
            {error}
          </div>
        )}

        {showForm && (
          <div className="mb-8">
            <ResourceForm
              selectedResource={selectedResource}
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
              submitting={submitting}
            />
          </div>
        )}

        <div className="mb-6">
          <ResourceStats stats={stats} lastSyncedAt={lastSyncedAt} />
        </div>

        <div className="mb-6">
          <ResourceFilterBar
            filters={filters}
            onChange={handleFilterChange}
            onSearch={handleSearch}
            onReset={handleReset}
          />
        </div>

        {loading && (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            Loading resources...
          </div>
        )}

        {!loading && resources.length === 0 && !error && (
          <EmptyState
            title="No resources found"
            message={
              hasActiveFilters
                ? "No resources matched the selected filters."
                : "No resources have been added yet."
            }
            onReset={hasActiveFilters ? handleReset : null}
          />
        )}

        {!loading && resources.length > 0 && (
          <div
            className={
              resources.length === 1
                ? "flex"
                : "grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3"
            }
          >
            {resources.map((resource) => (
              <div
                key={resource.id}
                className={resources.length === 1 ? "w-full max-w-[440px]" : ""}
              >
                <ResourceCard
                  resource={resource}
                  onViewDetails={setDetailsResource}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onStatusChange={handleStatusChange}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <ResourceDetailsModal
        resource={detailsResource}
        onClose={() => setDetailsResource(null)}
      />

      <DeleteConfirmModal
        resource={deleteTarget}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        processing={deleteProcessing}
      />
    </div>
  );
}

export default ResourceCatalogPage;