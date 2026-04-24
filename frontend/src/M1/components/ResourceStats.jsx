import React from 'react';
import './ResourceStats.css';

const TILES = [
  { key: 'totalResources',            label: 'Total Resources', bar: 'slate'   },
  { key: 'activeResources',           label: 'Active',          bar: 'emerald' },
  { key: 'outOfServiceResources',     label: 'Out of Service',  bar: 'rose'    },
  { key: 'underMaintenanceResources', label: 'Maintenance',     bar: 'amber'   },
  { key: 'totalCapacity',             label: 'Total Capacity',  bar: 'blue'    },
];

function ResourceStats({ stats, lastSyncedAt }) {
  if (!stats) return null;
  return (
    <section className="res-stats-section">
      <div className="res-stats-header">
        <h2>Resource Overview</h2>
        {lastSyncedAt && <span className="res-stats-sync">Last synced {lastSyncedAt}</span>}
      </div>
      <div className="res-stats-grid">
        {TILES.map(t => (
          <div key={t.key} className="res-stat-tile">
            <div className={`res-stat-tile-bar ${t.bar}`} />
            <div className="res-stat-tile-label">{t.label}</div>
            <div className="res-stat-tile-value">{stats[t.key]}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ResourceStats;
