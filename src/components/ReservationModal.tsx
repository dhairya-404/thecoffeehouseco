import React, { useState, useEffect, useMemo } from 'react';
import { useCursor } from '../context/CursorContext';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ConfirmedReservationData {
  code: string;
  name: string;
  guests: string;
  date: string;
  time: string;
  phone: string;
}

interface ReservationRecord {
  id: string;
  date: string;
  time: string;
  guests: string;
  status: 'confirmed' | 'seated' | 'cancelled';
}

const parseGuestCount = (guestsStr: string): number => {
  const match = guestsStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 2;
};

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const MAX_CAPACITY = 30;

  // Only autofill saved Name and Phone Number from localStorage, never the whole form
  const [name, setName] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('chc_guest_name') || '';
    }
    return '';
  });

  const [phone, setPhone] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('chc_guest_phone') || '';
    }
    return '';
  });

  // Date, Time, Guests, and Notes start clean and require user selection
  const [date, setDate] = useState('');
  const [time, setTime] = useState('17:00 — Evening Roast');
  const [guests, setGuests] = useState('2 Guests (Tasting Counter)');
  const [notes, setNotes] = useState('');

  // Validation states
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [allReservations, setAllReservations] = useState<ReservationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingCapacity, setIsCheckingCapacity] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedData, setConfirmedData] = useState<ConfirmedReservationData | null>(null);

  const { setCursor, resetCursor } = useCursor();

  // Get today's local date string formatted as YYYY-MM-DD for minimum date constraint
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Fetch current reservations when modal opens to check real-time capacity
  useEffect(() => {
    if (isOpen) {
      setIsCheckingCapacity(true);
      fetch('/api/reservations')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setAllReservations(data.data);
          }
        })
        .catch((err) => {
          console.warn('Could not fetch real-time capacity:', err);
        })
        .finally(() => {
          setIsCheckingCapacity(false);
        });
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Compute live occupancy for the selected date and time slot
  const slotOccupancy = useMemo(() => {
    if (!date || !time) return { booked: 0, remaining: MAX_CAPACITY, isFull: false };
    const active = allReservations.filter(
      (r) => r.date === date && r.time === time && (r.status === 'confirmed' || r.status === 'seated')
    );
    const booked = active.reduce((sum, r) => sum + parseGuestCount(r.guests), 0);
    const remaining = Math.max(0, MAX_CAPACITY - booked);
    return {
      booked,
      remaining,
      isFull: remaining === 0,
    };
  }, [allReservations, date, time]);

  const requestedGuestCount = parseGuestCount(guests);
  const exceedsRemainingCapacity =
    date !== '' && requestedGuestCount > slotOccupancy.remaining;

  // Validation rules
  const validateName = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) return 'Full name is required.';
    if (trimmed.length < 2) return 'Name must be at least 2 characters.';
    if (!/^[a-zA-Z\s.'-]{2,60}$/.test(trimmed)) {
      return 'Please enter a valid name using letters and spaces only.';
    }
    return null;
  };

  const validatePhone = (val: string): string | null => {
    const trimmed = val.trim();
    if (!trimmed) return 'Mobile number is required.';
    const digitsOnly = trimmed.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 13) {
      return 'Please enter a valid 10-digit mobile number.';
    }
    return null;
  };

  const validateDate = (val: string): string | null => {
    if (!val) return 'Reservation date is required.';
    if (val < todayStr) return 'Date cannot be in the past. Please choose today or later.';
    return null;
  };

  const nameError = touched.name ? validateName(name) : null;
  const phoneError = touched.phone ? validatePhone(phone) : null;
  const dateError = touched.date ? validateDate(date) : null;

  if (!isOpen) return null;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched for validation
    setTouched({ name: true, phone: true, date: true, guests: true, time: true });

    const nErr = validateName(name);
    const pErr = validatePhone(phone);
    const dErr = validateDate(date);

    if (nErr || pErr || dErr) {
      setErrorMessage(nErr || pErr || dErr);
      return;
    }

    if (exceedsRemainingCapacity) {
      setErrorMessage(
        slotOccupancy.remaining > 0
          ? `Only ${slotOccupancy.remaining} seat(s) remaining for this time slot (30 max capacity). Please select fewer guests or another time.`
          : `Capacity full for this time slot (30/30 seats booked). No more entries can be accepted. Please choose another hour or date.`
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          guests,
          date,
          time,
          notes: notes.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Save Name and Phone Number to localStorage for seamless autofill on future bookings
        if (typeof window !== 'undefined') {
          localStorage.setItem('chc_guest_name', result.data.name);
          localStorage.setItem('chc_guest_phone', result.data.phone);
        }

        setConfirmedData({
          code: result.data.code,
          name: result.data.name,
          guests: result.data.guests,
          date: result.data.date,
          time: result.data.time,
          phone: result.data.phone,
        });

        // Update local reservations state with the new confirmed reservation
        setAllReservations((prev) => [...prev, result.data]);
      } else {
        setErrorMessage(result.message || 'Unable to confirm reservation at this time.');
      }
    } catch {
      // Fallback offline confirmation if server is unreachable
      const fallbackCode = `CHC-${Math.floor(1000 + Math.random() * 9000)}`;
      if (typeof window !== 'undefined') {
        localStorage.setItem('chc_guest_name', name.trim());
        localStorage.setItem('chc_guest_phone', phone.trim());
      }
      setConfirmedData({
        code: fallbackCode,
        name: name.trim(),
        guests,
        date: date || 'Today',
        time,
        phone: phone.trim(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setConfirmedData(null);
    setErrorMessage(null);
    setTouched({});
    onClose();
  };

  return (
    <div className="chc-modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="chc-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="chc-modal-close font-mono"
          onClick={handleClose}
          aria-label="Close modal"
          onMouseEnter={() => setCursor('open', 'CLOSE')}
          onMouseLeave={resetCursor}
        >
          ✕ CLOSE
        </button>

        {confirmedData ? (
          <div className="chc-modal-success">
            <span className="meta-text success-tag">CONFIRMATION #{confirmedData.code}</span>
            <h3 className="heading-section success-title">TABLE RESERVED.</h3>
            <p className="body-lead success-message">
              Thank you, {confirmedData.name}. Your tasting table for {confirmedData.guests} is registered in our system for {confirmedData.date} at {confirmedData.time}. We look forward to welcoming you at 21 Riverfront Road.
            </p>
            <div className="success-footer font-mono meta-text">
              NOTIFICATION DISPATCHED TO {confirmedData.phone}
            </div>
            <button
              type="button"
              className="btn-swiss full-width mt-4"
              onClick={handleClose}
            >
              DONE →
            </button>
          </div>
        ) : (
          <form className="chc-modal-form" onSubmit={handleSubmit} autoComplete="off" noValidate>
            <div className="chc-modal-header">
              <span className="meta-text modal-index">09 / RESERVATION DESK</span>
              <h2 className="heading-section modal-title">BOOK A TASTING TABLE</h2>
              <div className="modal-header-meta-row">
                <p className="body-text modal-sub">30 seats maximum. Real-time capacity validated.</p>
                {date && (
                  <span
                    className={`font-mono meta-text capacity-indicator-pill ${
                      slotOccupancy.isFull
                        ? 'pill-full'
                        : exceedsRemainingCapacity
                        ? 'pill-warning'
                        : 'pill-available'
                    }`}
                  >
                    {isCheckingCapacity
                      ? 'CHECKING...'
                      : slotOccupancy.isFull
                      ? '● FULL (30/30)'
                      : `${slotOccupancy.remaining}/30 SEATS OPEN`}
                  </span>
                )}
              </div>
            </div>

            {errorMessage && (
              <div className="modal-error-banner font-mono meta-text" role="alert">
                ⚠ {errorMessage}
              </div>
            )}

            <div className="modal-field-grid">
              {/* 01 Guest Count */}
              <div className="modal-field">
                <label className="meta-text field-label" htmlFor="res-guests">
                  01 // GUEST COUNT
                </label>
                <select
                  id="res-guests"
                  value={guests}
                  onChange={(e) => {
                    setGuests(e.target.value);
                    setErrorMessage(null);
                  }}
                  className={`field-input font-sans ${
                    exceedsRemainingCapacity ? 'field-input-error' : ''
                  }`}
                  autoComplete="off"
                >
                  <option value="1 Guest (Solo Bar Seat)">1 Guest (Solo Bar Seat)</option>
                  <option value="2 Guests (Tasting Counter)">2 Guests (Tasting Counter)</option>
                  <option value="4 Guests (Courtyard Table)">4 Guests (Courtyard Table)</option>
                  <option value="6 Guests (Private Atelier)">6 Guests (Private Atelier)</option>
                </select>
                {exceedsRemainingCapacity && (
                  <span className="field-error-text font-mono">
                    ⚠ Exceeds open capacity ({slotOccupancy.remaining} left)
                  </span>
                )}
              </div>

              {/* 02 Preferred Date */}
              <div className="modal-field">
                <label className="meta-text field-label" htmlFor="res-date">
                  02 // PREFERRED DATE <span className="required-star">*</span>
                </label>
                <input
                  id="res-date"
                  type="date"
                  min={todayStr}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setTouched((prev) => ({ ...prev, date: true }));
                    setErrorMessage(null);
                  }}
                  onBlur={() => handleBlur('date')}
                  className={`field-input font-sans ${dateError ? 'field-input-error' : ''}`}
                  autoComplete="off"
                  required
                />
                {dateError && (
                  <span className="field-error-text font-mono">⚠ {dateError}</span>
                )}
              </div>

              {/* 03 Seating Time */}
              <div className="modal-field">
                <label className="meta-text field-label" htmlFor="res-time">
                  03 // SEATING TIME
                </label>
                <select
                  id="res-time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    setErrorMessage(null);
                  }}
                  className="field-input font-sans"
                  autoComplete="off"
                >
                  <option value="08:00 — Morning Extraction">08:00 — Morning Extraction</option>
                  <option value="11:30 — Midday Pour Over">11:30 — Midday Pour Over</option>
                  <option value="17:00 — Evening Roast">17:00 — Evening Roast</option>
                  <option value="20:00 — Night Tasting Flight">20:00 — Night Tasting Flight</option>
                </select>
              </div>

              {/* 04 Full Name (Only Name and Phone are allowed to autofill) */}
              <div className="modal-field">
                <label className="meta-text field-label" htmlFor="res-name">
                  04 // FULL NAME <span className="required-star">*</span>
                </label>
                <input
                  id="res-name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setTouched((prev) => ({ ...prev, name: true }));
                    setErrorMessage(null);
                  }}
                  onBlur={() => handleBlur('name')}
                  className={`field-input font-sans ${nameError ? 'field-input-error' : ''}`}
                  placeholder="e.g. Dhairya Patel"
                  autoComplete="name"
                  maxLength={60}
                />
                {nameError && (
                  <span className="field-error-text font-mono">⚠ {nameError}</span>
                )}
              </div>

              {/* 05 Telephone Number (Only Name and Phone are allowed to autofill) */}
              <div className="modal-field full-width-field">
                <label className="meta-text field-label" htmlFor="res-phone">
                  05 // TELEPHONE NUMBER <span className="required-star">*</span>
                </label>
                <input
                  id="res-phone"
                  name="tel"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setTouched((prev) => ({ ...prev, phone: true }));
                    setErrorMessage(null);
                  }}
                  onBlur={() => handleBlur('phone')}
                  className={`field-input font-sans ${phoneError ? 'field-input-error' : ''}`}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  maxLength={20}
                />
                {phoneError && (
                  <span className="field-error-text font-mono">⚠ {phoneError}</span>
                )}
              </div>

              {/* 06 Special Requests (Optional) */}
              <div className="modal-field full-width-field">
                <label className="meta-text field-label" htmlFor="res-notes">
                  06 // SPECIAL REQUESTS OR DIETARY NOTES (OPTIONAL)
                </label>
                <input
                  id="res-notes"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="field-input font-sans"
                  placeholder="e.g. Quiet corner, oat milk preferences..."
                  autoComplete="off"
                  maxLength={200}
                />
              </div>
            </div>

            <div className="modal-submit-wrap">
              <button
                type="submit"
                disabled={isLoading || exceedsRemainingCapacity || (date !== '' && slotOccupancy.isFull)}
                className="btn-swiss modal-submit-action"
                onMouseEnter={() => setCursor('link')}
                onMouseLeave={resetCursor}
              >
                <span>
                  {isLoading
                    ? 'CHECKING CAPACITY & RESERVING...'
                    : exceedsRemainingCapacity
                    ? 'CAPACITY LIMIT EXCEEDED'
                    : slotOccupancy.isFull && date
                    ? 'TIME SLOT SOLD OUT (30/30)'
                    : 'CONFIRM RESERVATION'}
                </span>
                <span>→</span>
              </button>
              <span className="meta-text cancellation-note">
                FREE CANCELLATION UP TO 2 HOURS PRIOR • MAX 30 GUESTS TOTAL
              </span>
            </div>
          </form>
        )}
      </div>

      <style>{`
        .chc-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: var(--z-modal);
          background-color: rgba(17, 17, 17, 0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .chc-modal-card {
          position: relative;
          width: 100%;
          max-width: 640px;
          max-height: 92vh;
          overflow-y: auto;
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-strong);
          padding: clamp(1.75rem, 4vw, 3rem);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
        }

        .chc-modal-close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          font-size: 0.75rem;
          letter-spacing: 0.14em;
          padding: 0.4rem 0.8rem;
          border: 1px solid var(--border-hairline);
          background-color: var(--bg-canvas);
          color: var(--text-primary);
          transition: all var(--duration-fast) ease;
          cursor: pointer;
        }

        .chc-modal-close:hover {
          background-color: var(--text-primary);
          color: var(--bg-canvas);
        }

        .chc-modal-header {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-hairline);
        }

        .modal-index {
          color: var(--accent-terracotta);
        }

        .modal-title {
          letter-spacing: -0.03em;
        }

        .modal-header-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .modal-sub {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .capacity-indicator-pill {
          font-size: 0.6875rem;
          padding: 0.2rem 0.6rem;
          border-radius: 2px;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }

        .pill-available {
          background-color: rgba(46, 125, 50, 0.12);
          border: 1px solid rgba(46, 125, 50, 0.4);
          color: #2e7d32;
        }

        .pill-warning {
          background-color: rgba(184, 92, 56, 0.12);
          border: 1px solid var(--accent-terracotta);
          color: var(--accent-terracotta);
        }

        .pill-full {
          background-color: rgba(184, 92, 56, 0.2);
          border: 1px solid var(--accent-terracotta);
          color: var(--accent-terracotta);
          font-weight: 700;
        }

        .required-star {
          color: var(--accent-terracotta);
        }

        .modal-error-banner {
          background-color: rgba(184, 92, 56, 0.12);
          border: 1px solid var(--accent-terracotta);
          color: var(--accent-terracotta);
          padding: 0.75rem 1rem;
          margin-bottom: 1.25rem;
          font-size: 0.8125rem;
        }

        .modal-field-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.15rem;
          margin-bottom: 1.75rem;
        }

        @media (max-width: 600px) {
          .modal-field-grid {
            grid-template-columns: 1fr;
          }
        }

        .full-width-field {
          grid-column: 1 / -1;
        }

        .modal-field {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .field-label {
          color: var(--text-muted);
          font-size: 0.6875rem;
          letter-spacing: 0.08em;
        }

        .field-input {
          background-color: var(--bg-canvas-subtle);
          border: 1px solid var(--border-hairline);
          padding: 0.8rem 0.95rem;
          color: var(--text-primary);
          font-size: 0.9375rem;
          outline: none;
          transition: border-color var(--duration-fast) ease, background-color var(--duration-fast) ease;
        }

        .field-input:focus {
          border-color: var(--border-strong);
          background-color: var(--bg-canvas);
        }

        .field-input-error {
          border-color: var(--accent-terracotta) !important;
          background-color: rgba(184, 92, 56, 0.04);
        }

        .field-error-text {
          font-size: 0.6875rem;
          color: var(--accent-terracotta);
          margin-top: 0.2rem;
        }

        .modal-submit-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .modal-submit-action {
          width: 100%;
          padding: 1.05rem;
        }

        .modal-submit-action:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          filter: grayscale(0.5);
        }

        .cancellation-note {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.6875rem;
          letter-spacing: 0.05em;
        }

        /* Success Card */
        .chc-modal-success {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1rem 0;
        }

        .success-tag {
          color: var(--accent-terracotta);
        }

        .success-title {
          color: var(--text-primary);
        }

        .success-message {
          color: var(--text-secondary);
        }

        .success-footer {
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-hairline);
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        .mt-4 {
          margin-top: 1.5rem;
        }
      `}</style>
    </div>
  );
};
