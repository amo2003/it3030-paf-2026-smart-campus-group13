import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createResource, deleteResource, getAllResources, getResourceStatistics, searchResources, updateResource, updateResourceStatus } from '../api/resourceApi';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import EmptyState from '../components/EmptyState';
import ResourceCard from '../components/ResourceCard';
import ResourceDetailsModal from '../components/ResourceDetailsModal';
import ResourceFilterBar from '../components/ResourceFilterBar';
import ResourceForm from '../components/ResourceForm';
import ResourceStats from '../components/ResourceStats';
import './ResourceCatalogPage.css';

function ResourceCatalogPage() {
  const [resources, setResources]         = useState([]);
  const [stats, setStats]                 = useState(null);
  const [filters, setFilters]             = useState({ keyword:'', type:'', minCapacity:'', location:'', status:'' });
  const [selectedResource, setSelectedResource] = useState(null);
  const [detailsResource, setDetailsResource]   = useState(null);
  const [deleteTarget, setDeleteTarget]   = useState(null);
  const [showForm, setShowForm]           = useState(false);
  const [loading, setLoading]             = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const [deleteProcessing, setDeleteProcessing] = useState(false);
  const [pageMessage, setPageMessage]     = useState('');
  const [error, setError]                 = useState('');
  const [lastSyncedAt, setLastSyncedAt]   = useState('');

  const hasActiveFilters = useMemo(() => Boolean(filters.keyword || filters.type || filters.minCapacity || filters.location || filters.status), [filters]);
  const setSyncNow = () => setLastSyncedAt(new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }));

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true); setError('');
      const [res, st] = await Promise.all([getAllResources(), getResourceStatistics()]);
      setResources(res); setStats(st); setSyncNow();
    } catch (e) { setError(e.message || 'Failed to load resources'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadInitialData(); }, [loadInitialData]);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const st = await getResourceStatistics(); setStats(st);
        if (!hasActiveFilters) { const res = await getAllResources(); setResources(res); }
        setSyncNow();
      } catch {}
    }, 60000);
    return () => clearInterval(id);
  }, [hasActiveFilters]);

  const handleFilterChange = e => setFilters({ ...filters, [e.target.name]: e.target.value });

  const handleSearch = async () => {
    try { setLoading(true); setError(''); setPageMessage(''); const d = await searchResources(filters); setResources(d); setSyncNow(); }
    catch (e) { setError(e.message || 'Search failed'); } finally { setLoading(false); }
  };

  const handleReset = async () => {
    setFilters({ keyword:'', type:'', minCapacity:'', location:'', status:'' });
    setPageMessage(''); setError(''); await loadInitialData();
  };

  const handleOpenCreate = () => { setSelectedResource(null); setShowForm(true); setPageMessage(''); setError(''); window.scrollTo({ top:0, behavior:'smooth' }); };
  const handleEdit = r => { setSelectedResource(r); setShowForm(true); setPageMessage(''); setError(''); window.scrollTo({ top:0, behavior:'smooth' }); };
  const handleCancelForm = () => { setSelectedResource(null); setShowForm(false); };

  const handleSubmitForm = async (payload) => {
    try {
      setSubmitting(true); setError(''); setPageMessage('');
      if (selectedResource) { await updateResource(selectedResource.id, payload); setPageMessage('Resource updated successfully.'); }
      else { await createResource(payload); setPageMessage('Resource created successfully.'); }
      setShowForm(false); setSelectedResource(null); await loadInitialData();
    } catch (e) { setError(e.message || 'Operation failed'); } finally { setSubmitting(false); }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteProcessing(true); setError(''); setPageMessage('');
      await deleteResource(deleteTarget.id); setPageMessage('Resource deleted successfully.'); setDeleteTarget(null); await loadInitialData();
    } catch (e) { setError(e.message || 'Delete failed'); } finally { setDeleteProcessing(false); }
  };

  const handleStatusChange = async (resource, status) => {
    try {
      setError(''); setPageMessage('');
      let outOfServiceUntil = null;
      if (status === 'OUT_OF_SERVICE') {
        const input = window.prompt('Enter date/time (YYYY-MM-DDTHH:mm)\nExample: 2026-04-25T10:30');
        if (!input) return;
        outOfServiceUntil = input;
      }
      await updateResourceStatus(resource.id, status, outOfServiceUntil);
      setPageMessage(`Resource status changed to ${status}.`); await loadInitialData();
    } catch (e) { setError(e.message || 'Status update failed'); }
  };

  return (
    <div className="res-catalog-page">
      <div className="res-catalog-inner">
        <section className="res-catalog-hero">
          <div className="res-catalog-hero-inner">
            <div>
              <h1>Facilities & Assets Catalogue</h1>
              <p>Smart Campus Operations Hub — Module 1</p>
            </div>
            <div className="res-catalog-hero-btns">
              <button className="hero-btn-white" onClick={handleOpenCreate}>+ Add New Resource</button>
              <button className="hero-btn-ghost" onClick={loadInitialData}>Refresh</button>
            </div>
          </div>
        </section>

        {pageMessage && <div className="res-catalog-alert success">{pageMessage}</div>}
        {error       && <div className="res-catalog-alert error">{error}</div>}

        {showForm && (
          <div className="res-catalog-section">
            <ResourceForm selectedResource={selectedResource} onSubmit={handleSubmitForm} onCancel={handleCancelForm} submitting={submitting} />
          </div>
        )}

        <div className="res-catalog-section"><ResourceStats stats={stats} lastSyncedAt={lastSyncedAt} /></div>
        <div className="res-catalog-section"><ResourceFilterBar filters={filters} onChange={handleFilterChange} onSearch={handleSearch} onReset={handleReset} /></div>

        {loading && <div className="res-catalog-loading">Loading resources...</div>}

        {!loading && resources.length === 0 && !error && (
          <EmptyState
            title="No resources found"
            message={hasActiveFilters ? 'No resources matched the selected filters.' : 'No resources have been added yet.'}
            onReset={hasActiveFilters ? handleReset : null}
          />
        )}

        {!loading && resources.length > 0 && (
          <div className={`res-catalog-grid${resources.length === 1 ? ' single' : ''}`}>
            {resources.map(r => (
              <div key={r.id}>
                <ResourceCard resource={r} onViewDetails={setDetailsResource} onEdit={handleEdit} onDelete={setDeleteTarget} onStatusChange={handleStatusChange} />
              </div>
            ))}
          </div>
        )}
      </div>

      <ResourceDetailsModal resource={detailsResource} onClose={() => setDetailsResource(null)} />
      <DeleteConfirmModal resource={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleConfirmDelete} processing={deleteProcessing} />
    </div>
  );
}

export default ResourceCatalogPage;
