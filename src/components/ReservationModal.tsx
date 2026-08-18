import React, { useState } from 'react';
import { useCursor } from '../context/CursorContext';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const [guests, setGuests] = useState('2 Guests');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('17:00');
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
    }, 2500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
          onMouseEnter={() => setCursor('open', 'CLOSE')}
          onMouseLeave={resetCursor}
        >
          ✕
        </button>

        {isSubmitted ? (
          <div className="modal-success-box">
            <div className="success-icon">✦</div>
            <h3 className="heading-3">TABLE RESERVED</h3>
            <p className="body-lead">
              Thank you, {name}! Your tasting table for {guests} is reserved for {date || 'today'} at {time}. We look forward to welcoming you.
            </p>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-header">
              <span className="label-caps">SEASONAL TASTING TABLE</span>
              <h2 className="heading-2">RESERVE AT EMBER & BEAN</h2>
              <p className="modal-sub">Sabarmati Riverfront • Ahmedabad</p>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">GUESTS</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="form-input"
                >
                  <option>1 Guest (Solo Bar Seat)</option>
                  <option>2 Guests (Tasting Counter)</option>
                  <option>4 Guests (Courtyard Table)</option>
                  <option>6+ Guests (Private Atelier)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">DATE</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">PREFERRED TIME</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="form-input"
                >
                  <option value="08:00">08:00 AM — Morning Drip</option>
                  <option value="11:30">11:30 AM — Midday Pour</option>
                  <option value="17:00">05:00 PM — Evening Roast</option>
                  <option value="20:00">08:00 PM — Night Tasting</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">FULL NAME</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  placeholder="Your Name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">PHONE NUMBER</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  placeholder="+91 Phone"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-magnetic btn-primary modal-submit-btn"
              onMouseEnter={() => setCursor('link')}
              onMouseLeave={resetCursor}
            >
              CONFIRM RESERVATION →
            </button>
          </form>
        )}
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: var(--z-modal);
          background-color: rgba(10, 8, 7, 0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: fadeIn 0.3s ease;
        }

        .modal-card {
          position: relative;
          width: 100%;
          max-width: 540px;
          background: #181412;
          border: 1px solid var(--border-light);
          border-radius: 12px;
          padding: 2.5rem 2rem;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
        }

        .modal-close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: transparent;
          border: none;
          color: var(--text-muted);
          font-size: 1.2rem;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .modal-close-btn:hover {
          color: var(--accent-copper);
        }

        .modal-header {
          margin-bottom: 2rem;
        }

        .modal-sub {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
          letter-spacing: 0.05em;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-label {
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          color: var(--accent-copper);
          font-weight: 600;
        }

        .form-input {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          padding: 0.75rem 1rem;
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .form-input:focus {
          border-color: var(--accent-copper);
        }

        .modal-submit-btn {
          width: 100%;
          justify-content: center;
          padding: 0.9rem;
        }

        .modal-success-box {
          text-align: center;
          padding: 2rem 1rem;
        }

        .success-icon {
          font-size: 2.5rem;
          color: var(--accent-copper);
          margin-bottom: 1rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
