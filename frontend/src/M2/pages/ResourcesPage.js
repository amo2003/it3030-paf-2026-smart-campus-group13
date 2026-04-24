import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResourcesPage.css';

const BASE = 'http://localhost:8080/api/module1/resources';
const TYPE_ICONS = { LECTURE_HALL: '🏛️', LAB: '🔬', MEETING_ROOM: '🤝', EQUIPMENT: '🖥️' };

function formatType(type) {
  return type?.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) || '-';
}

function statusClass(status) {
  if (status === 'ACTIVE')            return 'status-active';
  if (status === 'OUT_OF_SERVICE')    return 'status-out';
  if (status === 'UNDER_MAINTENANCE') return 'status-maintenance';
  return '';
}

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [stats,     setStats]     = useState(null);
  const [filter,    setFilter]    = useState('ALL');
  const [search,    setSearch]    = useState('');
  const [loading,   setLoading]   = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  useEffect(() => {
    Promise.all([
      fetch(BASE).then(r => r.json()),
      fetch(`${BASE}/statistics`).then(r => r.json()),
    ])
      .then(([res, st]) => { setResources(res); setStats(st); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleBook = (resource) => {
    const params = new URLSearchParams({
      resourceId:   resource.id,
      resourceName: resource.name,
      ...(user?.id    && { userId:    user.id    }),
      ...(user?.email && { userEmail: user.email }),
    });
    navigate(`/book?${params.toString()}`);
  };

  const filtered = resources.filter(r => {
    const matchStatus = filter === 'ALL' || r.status === filter;
    const matchSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.toLowerCase().includes(search.toLowerCase()) ||
      r.type?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="resources-page">

      {/* Header */}
      <div className="resources-header">
        <h1>Campus Resources</h1>
        <p>Browse available facilities and book instantly</p>
      </div>

      {/* Stat cards */}
      {stats && (
        <div className="resources-stats">
          {[
            { label: 'Total Resources', value: stats.totalResources,        icon: '🏢', cls: 'indigo' },
            { label: 'Active',          value: stats.activeResources,       icon: '✅', cls: 'green'  },
            { label: 'Out of Service',  value: stats.outOfServiceResources, icon: '🚫', cls: 'red'    },
            { label: 'Total Capacity',  value: stats.totalCapacity,         icon: '👥', cls: 'blue'   },
          ].map(s => (
            <div key={s.label} className={`res-stat-card ${s.cls}`}>
              <div>
                <div className="res-stat-label">{s.label}</div>
                <div className="res-stat-value">{s.value}</div>
              </div>
              <div className="res-stat-icon">{s.icon}</div>
            </div>
          ))}
        </div>
      )}

      {/* Search + filter */}
      <div className="resources-toolbar">
        <input
          className="resources-search"
          type="text"
          placeholder="Search by name, location or type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-pills">
          {['ALL', 'ACTIVE', 'OUT_OF_SERVICE', 'UNDER_MAINTENANCE'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`filter-pill${filter === s ? ' active' : ''}`}
            >
              {s === 'ALL' ? 'All' : formatType(s)}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {loading && <p className="state-msg">Loading resources...</p>}

      {!loading && filtered.length === 0 && (
        <div className="resources-empty">
          <div className="empty-icon">🏢</div>
          <p>No resources found.</p>
        </div>
      )}

      {/* Cards */}
      {!loading && filtered.length > 0 && (
        <div className="resources-grid">
          {filtered.map(r => {
            const isBookable = r.status === 'ACTIVE';
            return (
              <div key={r.id} className="res-card">
                {/* accent bar */}
                <div className={`res-card-bar${isBookable ? ' bookable' : ''}`} />

                <div className="res-card-body">
                  {/* title + badge */}
                  <div className="res-card-top">
                    <div className="res-card-title-row">
                      <span className="res-card-type-icon">{TYPE_ICONS[r.type] || '🏢'}</span>
                      <div>
                        <div className="res-card-name">{r.name}</div>
                        <div className="res-card-code">{r.resourceCode}</div>
                      </div>
                    </div>
                    <span className={`res-status-badge ${statusClass(r.status)}`}>
                      {r.status?.replaceAll('_', ' ')}
                    </span>
                  </div>

                  {/* details */}
                  <div className="res-card-details">
                    <div><span>Type:</span> {formatType(r.type)}</div>
                    <div><span>Capacity:</span> {r.capacity}</div>
                    <div className="full"><span>Location:</span> {r.location}</div>
                    {r.availableFrom && r.availableTo && (
                      <div className="full">
                        <span>Hours:</span> {r.availableFrom} – {r.availableTo}
                      </div>
                    )}
                  </div>

                  {r.description && (
                    <p className="res-card-desc">{r.description}</p>
                  )}

                  <div className="res-card-divider" />

                  {/* book button */}
                  <button
                    onClick={() => handleBook(r)}
                    disabled={!isBookable}
                    className={`res-book-btn ${isBookable ? 'bookable' : 'unavailable'}`}
                  >
                    {isBookable ? '📅 Book Now' : '🚫 Not Available'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
