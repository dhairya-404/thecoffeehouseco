import React, { useState } from 'react';
import { useCursor } from '../context/CursorContext';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const [guests, setGuests] = useState('2 Guests (Tasting Counter)');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('17:00 — Evening Roast');
  const [name, setName] = useState('Dhairya Patel');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { setCursor, resetCursor } = useCursor();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="chc-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="chc-modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="chc-modal-close font-mono"
          onClick={onClose}
          aria-label="Close modal"
          onMouseEnter={() => setCursor('open', 'CLOSE')}
          onMouseLeave={resetCursor}
        >
          ✕ CLOSE
        </button>

        {isSubmitted ? (
          <div className="chc-modal-success">
            <span className="meta-text success-tag">CONFIRMATION #CHC-{Math.floor(1000 + Math.random() * 9000)}</span>
            <h3 className="heading-section success-title">TABLE RESERVED.</h3>
            <p className="body-lead success-message">
              Thank you, {name}. Your tasting table for {guests} is scheduled for {date || 'today'} at {time}. We look forward to your arrival at 21 Riverfront Road.
            </p>
            <div className="success-footer font-mono meta-text">
              NOTIFICATION SENT TO {phone}
            </div>
          </div>
        ) : (
          <form className="chc-modal-form" onSubmit={handleSubmit}>
            <div className="chc-modal-header">
              <span className="meta-text modal-index">09 / RESERVATION DESK</span>
              <h2 className="heading-section modal-title">BOOK A TASTING TABLE</h2>
              <p className="body-text modal-sub">24 seats total. Advance reservation recommended.</p>
            </div>

            <div className="modal-field-grid">
              <div className="modal-field">
                <label className="meta-text field-label">01 // GUEST COUNT</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="field-input font-sans"
                >
                  <option>1 Guest (Solo Bar Seat)</option>
                  <option>2 Guests (Tasting Counter)</option>
                  <option>4 Guests (Courtyard Table)</option>
                  <option>6 Guests (Private Atelier)</option>
                </select>
              </div>

              <div className="modal-field">
                <label className="meta-text field-label">02 // PREFERRED DATE</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="field-input font-sans"
                  required
                />
              </div>

              <div className="modal-field">
                <label className="meta-text field-label">03 // SEATING TIME</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="field-input font-sans"
                >
                  <option>08:00 — Morning Extraction</option>
                  <option>11:30 — Midday Pour Over</option>
                  <option>17:00 — Evening Roast</option>
                  <option>20:00 — Night Tasting Flight</option>
                </select>
              </div>

              <div className="modal-field">
                <label className="meta-text field-label">04 // FULL NAME</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="field-input font-sans"
                  placeholder="Your Name"
                />
              </div>

              <div className="modal-field full-width-field">
                <label className="meta-text field-label">05 // TELEPHONE NUMBER</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="field-input font-sans"
                  placeholder="+91 Mobile Number"
                />
              </div>
            </div>

            <div className="modal-submit-wrap">
              <button
                type="submit"
                className="btn-swiss modal-submit-action"
                onMouseEnter={() => setCursor('link')}
                onMouseLeave={resetCursor}
              >
                <span>CONFIRM RESERVATION</span>
                <span>→</span>
              </button>
              <span className="meta-text cancellation-note">FREE CANCELLATION UP TO 2 HOURS PRIOR</span>
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
          max-width: 620px;
          background-color: var(--bg-canvas);
          border: 1px solid var(--border-strong);
          padding: clamp(2rem, 5vw, 3.5rem);
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
        }

        .chc-modal-close:hover {
          background-color: var(--text-primary);
          color: var(--bg-canvas);
        }

        .chc-modal-header {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 2rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid var(--border-hairline);
        }

        .modal-index {
          color: var(--accent-terracotta);
        }

        .modal-title {
          letter-spacing: -0.03em;
        }

        .modal-sub {
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .modal-field-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
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
          gap: 0.5rem;
        }

        .field-label {
          color: var(--text-muted);
          font-size: 0.6875rem;
        }

        .field-input {
          background-color: var(--bg-canvas-subtle);
          border: 1px solid var(--border-hairline);
          padding: 0.85rem 1rem;
          color: var(--text-primary);
          font-size: 0.95rem;
          outline: none;
          transition: border-color var(--duration-fast) ease;
        }

        .field-input:focus {
          border-color: var(--border-strong);
          background-color: var(--bg-canvas);
        }

        .modal-submit-wrap {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .modal-submit-action {
          width: 100%;
          padding: 1.1rem;
        }

        .cancellation-note {
          text-align: center;
          color: var(--text-muted);
          font-size: 0.6875rem;
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
      `}</style>
    </div>
  );
};
