import React, { useState, useEffect } from 'react';
import { useCursor } from '../context/CursorContext';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ReservationRecord {
  id: string;
  code: string;
  name: string;
  phone: string;
  guests: string;
  date: string;
  time: string;
  notes?: string;
  status: 'confirmed' | 'seated' | 'cancelled';
  createdAt: string;
}

interface SubscriberRecord {
  id: string;
  email: string;
  createdAt: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'reservations' | 'subscribers'>('reservations');
  const [reservations, setReservations] = useState<ReservationRecord[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>([]);
  const [filterDate, setFilterDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { setCursor, resetCursor } = useCursor();

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const [resRes, subRes] = await Promise.all([
        fetch('/api/reservations'),
        fetch('/api/newsletter'),
      ]);
      const resData = await resRes.json();
      const subData = await subRes.json();

      if (resData.success) setReservations(resData.data);
      if (subData.success) setSubscribers(subData.data);
    } catch (err) {
      console.warn('Failed to load admin data from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRecords();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUpdateStatus = async (id: string, newStatus: 'confirmed' | 'seated' | 'cancelled') => {
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setReservations((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.warn('Update status error:', err);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    const matchesDate = filterDate ? r.date === filterDate : true;
    const matchesSearch = searchQuery
      ? r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phone.includes(searchQuery) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesDate && matchesSearch;
  });

  const totalGuestsBooked = filteredReservations
    .filter((r) => r.status !== 'cancelled')
    .reduce((acc, curr) => {
      const count = parseInt(curr.guests, 10) || 2;
      return acc + count;
    }, 0);

  return (
    <div className="admin-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="admin-portal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="admin-header-bar">
          <div>
            <span className="meta-text admin-tag">MANAGEMENT CONSOLE</span>
            <h2 className="heading-title admin-title">CAFÉ DISPATCH & RESERVATIONS</h2>
          </div>
          <button
            type="button"
            className="chc-modal-close font-mono"
            onClick={onClose}
            aria-label="Close admin portal"
            onMouseEnter={() => setCursor('open', 'CLOSE')}
            onMouseLeave={resetCursor}
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Metrics Row */}
        <div className="admin-metrics-row">
          <div className="admin-metric-box">
            <span className="meta-text">TOTAL BOOKINGS</span>
            <span className="metric-val font-display">{reservations.length}</span>
          </div>
          <div className="admin-metric-box">
            <span className="meta-text">CAPACITY OCCUPIED</span>
            <span className="metric-val font-display">
              {totalGuestsBooked} <span className="capacity-max font-mono">/ 24 SEATS</span>
            </span>
          </div>
          <div className="admin-metric-box">
            <span className="meta-text">DISPATCH SUBSCRIBERS</span>
            <span className="metric-val font-display">{subscribers.length}</span>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="admin-tabs-bar">
          <button
            type="button"
            className={`admin-tab-btn font-mono ${activeTab === 'reservations' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('reservations')}
          >
            01 // LIVE RESERVATIONS ({reservations.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn font-mono ${activeTab === 'subscribers' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('subscribers')}
          >
            02 // DISPATCH SUBSCRIBERS ({subscribers.length})
          </button>
        </div>

        {/* Content View */}
        {activeTab === 'reservations' ? (
          <div className="admin-content-wrap">
            {/* Filter controls */}
            <div className="admin-filter-bar">
              <input
                type="text"
                placeholder="Search name, phone, code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="admin-filter-input font-sans"
              />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="admin-filter-input font-sans"
              />
              {filterDate && (
                <button
                  type="button"
                  className="btn-swiss btn-swiss-outline admin-clear-btn font-mono"
                  onClick={() => setFilterDate('')}
                >
                  CLEAR DATE
                </button>
              )}
              <button
                type="button"
                className="btn-swiss btn-swiss-outline admin-refresh-btn font-mono"
                onClick={fetchRecords}
              >
                {isLoading ? 'SYNCING...' : 'REFRESH'}
              </button>
            </div>

            {/* Table */}
            <div className="admin-table-scroll">
              <table className="admin-data-table font-sans">
                <thead>
                  <tr className="meta-text">
                    <th>CODE</th>
                    <th>GUEST NAME</th>
                    <th>SEATING / TIME</th>
                    <th>DATE</th>
                    <th>TELEPHONE</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="empty-row font-mono meta-text">
                        No reservations recorded matching the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredReservations.map((r) => (
                      <tr key={r.id} className={`row-status-${r.status}`}>
                        <td className="font-mono font-semibold">{r.code}</td>
                        <td>
                          <div className="guest-name-box">
                            <span className="guest-name">{r.name}</span>
                            {r.notes && <span className="guest-notes font-mono">“{r.notes}”</span>}
                          </div>
                        </td>
                        <td>{r.guests} • {r.time}</td>
                        <td className="font-mono">{r.date}</td>
                        <td className="font-mono">{r.phone}</td>
                        <td>
                          <span className={`status-badge font-mono badge-${r.status}`}>
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons-group">
                            {r.status !== 'seated' && (
                              <button
                                type="button"
                                className="action-btn font-mono btn-seat"
                                onClick={() => handleUpdateStatus(r.id, 'seated')}
                              >
                                SEATED
                              </button>
                            )}
                            {r.status !== 'cancelled' && (
                              <button
                                type="button"
                                className="action-btn font-mono btn-cancel"
                                onClick={() => handleUpdateStatus(r.id, 'cancelled')}
                              >
                                CANCEL
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="admin-content-wrap">
            <div className="admin-table-scroll">
              <table className="admin-data-table font-sans">
                <thead>
                  <tr className="meta-text">
                    <th>#</th>
                    <th>SUBSCRIBER EMAIL</th>
                    <th>SUBSCRIBED AT</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub, idx) => (
                    <tr key={sub.id}>
                      <td className="font-mono">{String(idx + 1).padStart(2, '0')}</td>
                      <td className="font-mono">{sub.email}</td>
                      <td className="font-mono">{new Date(sub.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: var(--z-modal);
          background-color: rgba(17, 17, 17, 0.92);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .admin-portal-card {
          position: relative;
          width: 100%;
          max-width: 1120px;
          max-height: 90vh;
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-strong);
          padding: clamp(1.5rem, 3.5vw, 2.5rem);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          overflow: hidden;
        }

        .admin-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--border-hairline);
          padding-bottom: 1rem;
        }

        .admin-tag {
          color: var(--accent-terracotta);
          margin-bottom: 0.25rem;
          display: block;
        }

        .admin-metrics-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        @media (max-width: 700px) {
          .admin-metrics-row {
            grid-template-columns: 1fr;
          }
        }

        .admin-metric-box {
          background-color: var(--bg-canvas-subtle);
          border: 1px solid var(--border-hairline);
          padding: 1rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .metric-val {
          font-size: 1.85rem;
          color: var(--text-primary);
        }

        .capacity-max {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .admin-tabs-bar {
          display: flex;
          border-bottom: 1px solid var(--border-hairline);
          gap: 0.5rem;
        }

        .admin-tab-btn {
          padding: 0.75rem 1.25rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          border-bottom: 2px solid transparent;
          cursor: pointer;
        }

        .admin-tab-btn.is-active {
          color: var(--text-primary);
          border-bottom-color: var(--accent-terracotta);
          font-weight: 700;
        }

        .admin-content-wrap {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow: hidden;
        }

        .admin-filter-bar {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .admin-filter-input {
          background-color: var(--bg-canvas-subtle);
          border: 1px solid var(--border-hairline);
          padding: 0.6rem 0.85rem;
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
        }

        .admin-clear-btn,
        .admin-refresh-btn {
          padding: 0.6rem 1rem;
          font-size: 0.75rem;
        }

        .admin-table-scroll {
          overflow-x: auto;
          overflow-y: auto;
          max-height: 50vh;
          border: 1px solid var(--border-hairline);
        }

        .admin-data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.875rem;
        }

        .admin-data-table th {
          background-color: var(--bg-canvas-subtle);
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--border-hairline);
          position: sticky;
          top: 0;
          z-index: 2;
        }

        .admin-data-table td {
          padding: 0.85rem 1rem;
          border-bottom: 1px solid var(--border-hairline);
        }

        .guest-name-box {
          display: flex;
          flex-direction: column;
        }

        .guest-notes {
          font-size: 0.75rem;
          color: var(--accent-coffee);
        }

        .status-badge {
          display: inline-block;
          font-size: 0.6875rem;
          padding: 0.25rem 0.5rem;
          border: 1px solid currentColor;
        }

        .badge-confirmed {
          color: var(--accent-coffee);
        }

        .badge-seated {
          color: #2E7D32;
        }

        .badge-cancelled {
          color: var(--accent-terracotta);
          opacity: 0.7;
        }

        .action-buttons-group {
          display: flex;
          gap: 0.4rem;
        }

        .action-btn {
          font-size: 0.6875rem;
          padding: 0.3rem 0.5rem;
          border: 1px solid var(--border-hairline);
          background-color: transparent;
          cursor: pointer;
        }

        .btn-seat:hover {
          background-color: #2E7D32;
          color: #FFFFFF;
        }

        .btn-cancel:hover {
          background-color: var(--accent-terracotta);
          color: #FFFFFF;
        }

        .empty-row {
          text-align: center;
          padding: 2.5rem 1rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
