import React, { useState } from 'react';
import { BRAND_INFO } from '../data/cafeData';
import { MagneticButton } from './MagneticButton';
import { useCursor } from '../context/CursorContext';

interface LocationProps {
  onReserveClick?: () => void;
}

export const Location: React.FC<LocationProps> = () => {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingGuests, setBookingGuests] = useState('2 Guests');
  const [bookingTime, setBookingTime] = useState('Morning (9:00 AM)');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { setCursor, resetCursor } = useCursor();

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(BRAND_INFO.location);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowReserveModal(false);
    }, 2200);
  };

  return (
    <section id="location" className="location-section" aria-label="Café Location and Hours">
      <div className="container">
        {/* Section Header */}
        <div className="location-header">
          <span className="label-caps">SANCTUARY & VISITING</span>
          <h2 className="heading-1 location-heading">
            COME <span className="font-editorial italic text-copper">FIND US.</span>
          </h2>
        </div>

        {/* 2-Column Editorial Grid */}
        <div className="location-content-grid">
          {/* Left Column: Operational Specs & Details */}
          <div className="location-details-card">
            {/* Live Status Badge */}
            <div className="live-status-row">
              <span className="status-indicator-dot"></span>
              <span className="status-label">CURRENTLY OPEN • ROASTING & POURING</span>
            </div>

            <div className="location-info-block">
              <span className="info-subhead">ADDRESS</span>
              <p className="address-text">{BRAND_INFO.location}</p>
              <div className="coord-tag">{BRAND_INFO.coordinates}</div>
            </div>

            <div className="location-info-block">
              <span className="info-subhead">OPENING HOURS</span>
              <div className="hours-grid">
                <div className="hour-row">
                  <span className="days">MONDAY – FRIDAY</span>
                  <span className="times">07:00 — 22:00</span>
                </div>
                <div className="hour-row">
                  <span className="days">SATURDAY – SUNDAY</span>
                  <span className="times">08:00 — 23:00</span>
                </div>
              </div>
            </div>

            <div className="location-info-block">
              <span className="info-subhead">CONTACT & ENQUIRIES</span>
              <p className="contact-line">T: {BRAND_INFO.phone}</p>
              <p className="contact-line">E: {BRAND_INFO.email}</p>
            </div>

            {/* Action Buttons */}
            <div className="location-cta-group">
              <MagneticButton
                className="btn-magnetic btn-primary"
                cursorText="DIRECTIONS"
                onClick={handleCopyAddress}
              >
                {copiedAddress ? 'ADDRESS COPIED! ✓' : 'GET DIRECTIONS →'}
              </MagneticButton>

              <MagneticButton
                className="btn-magnetic btn-outline-light"
                cursorText="RESERVE"
                onClick={() => setShowReserveModal(true)}
              >
                RESERVE A TABLE
              </MagneticButton>
            </div>
          </div>

          {/* Right Column: Stylized Minimalist Riverfront Architectural Vector Map */}
          <div
            className="location-map-card"
            onMouseEnter={() => setCursor('open', 'MAP')}
            onMouseLeave={resetCursor}
          >
            <div className="map-vector-wrap">
              <svg
                viewBox="0 0 600 500"
                className="riverfront-map-svg"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Grid */}
                <defs>
                  <pattern id="mapGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(245,240,235,0.03)" strokeWidth="1"/>
                  </pattern>
                  <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1E282A" stopOpacity="0.8"/>
                    <stop offset="50%" stopColor="#253538" stopOpacity="0.9"/>
                    <stop offset="100%" stopColor="#182123" stopOpacity="0.8"/>
                  </linearGradient>
                </defs>

                <rect width="600" height="500" fill="#14100E"/>
                <rect width="600" height="500" fill="url(#mapGrid)"/>

                {/* Sabarmati River Curving Path */}
                <path
                  d="M -50 400 C 150 380, 250 220, 320 150 C 400 70, 500 40, 650 20 L 650 -20 L -50 -20 Z"
                  fill="url(#riverGradient)"
                  stroke="#2E4448"
                  strokeWidth="1.5"
                />

                {/* River Waves / Contours */}
                <path d="M -20 380 C 180 360, 260 210, 340 130 C 420 50, 520 25, 620 10" fill="none" stroke="rgba(110,160,170,0.15)" strokeWidth="1" strokeDasharray="6 4"/>
                <path d="M 50 420 C 220 390, 290 240, 370 160 C 450 80, 540 50, 640 35" fill="none" stroke="rgba(110,160,170,0.1)" strokeWidth="1"/>

                <text x="180" y="290" fill="rgba(110,160,170,0.3)" fontFamily="Inter" fontSize="10" letterSpacing="0.25em" transform="rotate(-30 180 290)">
                  SABARMATI RIVERFRONT
                </text>

                {/* Road Networks */}
                <line x1="80" y1="0" x2="80" y2="500" stroke="rgba(245,240,235,0.08)" strokeWidth="1.5"/>
                <line x1="220" y1="0" x2="220" y2="500" stroke="rgba(245,240,235,0.06)" strokeWidth="1"/>
                <line x1="450" y1="0" x2="450" y2="500" stroke="rgba(245,240,235,0.06)" strokeWidth="1"/>

                <line x1="0" y1="120" x2="600" y2="120" stroke="rgba(245,240,235,0.06)" strokeWidth="1"/>
                <line x1="0" y1="320" x2="600" y2="320" stroke="rgba(245,240,235,0.08)" strokeWidth="1.5"/>
                <line x1="0" y1="440" x2="600" y2="440" stroke="rgba(245,240,235,0.05)" strokeWidth="1"/>

                {/* Promenade Promenade Line */}
                <path d="M 30 460 C 200 420, 290 280, 360 200 C 440 110, 530 80, 620 60" fill="none" stroke="#C87A53" strokeWidth="2" strokeDasharray="3 3"/>

                {/* Landmarks */}
                <circle cx="160" cy="180" r="3" fill="#6A625A"/>
                <text x="170" y="183" fill="#7A7168" fontFamily="Inter" fontSize="9" letterSpacing="0.1em">ELLIS BRIDGE</text>

                <circle cx="440" cy="380" r="3" fill="#6A625A"/>
                <text x="450" y="383" fill="#7A7168" fontFamily="Inter" fontSize="9" letterSpacing="0.1em">NEHRU BRIDGE</text>

                {/* EMBER & BEAN Pin Location */}
                <g transform="translate(370, 210)">
                  <circle cx="0" cy="0" r="28" fill="rgba(200,122,83,0.15)">
                    <animate attributeName="r" values="16;36;16" dur="3s" repeatCount="indefinite"/>
                    <animate attributeName="opacity" values="0.8;0.1;0.8" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="0" cy="0" r="8" fill="#C87A53"/>
                  <circle cx="0" cy="0" r="3" fill="#FFFFFF"/>

                  {/* Tooltip Label */}
                  <rect x="-70" y="-46" width="140" height="30" rx="4" fill="#1F1A16" stroke="#C87A53" strokeWidth="1"/>
                  <text x="0" y="-28" fill="#F5F0EB" fontFamily="Inter" fontSize="10" fontWeight="600" letterSpacing="0.12em" textAnchor="middle">
                    EMBER & BEAN
                  </text>
                  <polygon points="-4,-16 4,-16 0,-10" fill="#1F1A16"/>
                </g>
              </svg>

              <div className="map-badge-bottom">
                <span className="map-tag">21 RIVERFRONT ROAD</span>
                <span className="map-status">VALET PARKING AVAILABLE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showReserveModal && (
        <div className="reserve-modal-overlay" onClick={() => setShowReserveModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowReserveModal(false)}>✕</button>

            <span className="label-caps">TABLE RESERVATIONS</span>
            <h3 className="reserve-modal-title">THE SLOW TABLE</h3>
            <p className="reserve-modal-desc">
              We reserve a limited number of tables for guests wishing to spend a quiet morning or afternoon with manual brew flights.
            </p>

            {bookingSuccess ? (
              <div className="booking-success-box">
                <div className="success-icon">✓</div>
                <h4>TABLE REQUEST RECEIVED</h4>
                <p>We have reserved a quiet corner for you. A confirmation SMS will be sent shortly.</p>
              </div>
            ) : (
              <form className="reserve-form" onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label className="form-label">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="Dhairya Patel"
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">PARTY SIZE</label>
                    <select
                      value={bookingGuests}
                      onChange={(e) => setBookingGuests(e.target.value)}
                      className="form-input"
                    >
                      <option>1 Guest (Quiet Study)</option>
                      <option>2 Guests (Conversation)</option>
                      <option>3-4 Guests (Tasting Flight)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">PREFERRED WINDOW</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="form-input"
                    >
                      <option>Morning (8:30 AM – 11:00 AM)</option>
                      <option>Afternoon Light (2:00 PM – 5:00 PM)</option>
                      <option>Dusk & Sunset (6:00 PM – 9:00 PM)</option>
                    </select>
                  </div>
                </div>

                <MagneticButton type="submit" className="btn-magnetic btn-primary form-submit-btn">
                  CONFIRM RESERVATION →
                </MagneticButton>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        .location-section {
          position: relative;
          background-color: var(--bg-secondary);
          padding-top: clamp(6rem, 11vw, 11rem);
          padding-bottom: clamp(6rem, 11vw, 11rem);
          border-top: 1px solid var(--border-light);
        }

        .location-header {
          margin-bottom: 4rem;
        }

        .location-heading {
          margin-top: 0.5rem;
          color: var(--text-primary);
        }

        .text-copper {
          color: var(--accent-copper);
        }

        .location-content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3.5rem;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .location-content-grid {
            grid-template-columns: 1fr 1.1fr;
            gap: 5rem;
          }
        }

        .location-details-card {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .live-status-row {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(200, 122, 83, 0.1);
          border: 1px solid var(--border-copper);
          padding: 0.45rem 1rem;
          border-radius: 9999px;
          width: fit-content;
        }

        .status-indicator-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #48BB78;
          box-shadow: 0 0 8px #48BB78;
        }

        .status-label {
          font-size: var(--text-2xs);
          letter-spacing: 0.15em;
          color: var(--text-primary);
          font-weight: 600;
        }

        .location-info-block {
          border-top: 1px solid var(--border-light);
          padding-top: 1.5rem;
        }

        .info-subhead {
          font-size: var(--text-2xs);
          letter-spacing: 0.2em;
          color: var(--accent-copper);
          font-weight: 600;
          display: block;
          margin-bottom: 0.5rem;
        }

        .address-text {
          font-family: var(--font-serif);
          font-size: 1.35rem;
          color: var(--text-primary);
          line-height: 1.35;
        }

        .coord-tag {
          font-size: var(--text-xs);
          color: var(--text-muted);
          margin-top: 0.4rem;
          letter-spacing: 0.08em;
        }

        .hours-grid {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .hour-row {
          display: flex;
          justify-content: space-between;
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .hour-row .times {
          color: var(--text-primary);
          font-weight: 500;
        }

        .contact-line {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .location-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          margin-top: 1rem;
        }

        /* Map Card */
        .location-map-card {
          position: relative;
          background-color: #14100E;
          border: 1px solid var(--border-light);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
        }

        .map-vector-wrap {
          position: relative;
          width: 100%;
          height: auto;
        }

        .riverfront-map-svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .map-badge-bottom {
          position: absolute;
          bottom: 1.25rem;
          left: 1.25rem;
          right: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(15, 12, 10, 0.85);
          backdrop-filter: blur(8px);
          padding: 0.6rem 1.25rem;
          border-radius: 4px;
          border: 1px solid var(--border-light);
        }

        .map-tag {
          font-size: var(--text-2xs);
          letter-spacing: 0.15em;
          color: var(--accent-copper);
          font-weight: 600;
        }

        .map-status {
          font-size: 0.625rem;
          letter-spacing: 0.12em;
          color: var(--text-muted);
        }

        /* Reservation Modal */
        .reserve-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: var(--z-modal);
          background: rgba(10, 8, 7, 0.88);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .modal-card {
          position: relative;
          background: #171310;
          border: 1px solid var(--border-medium);
          border-radius: 8px;
          padding: 2.5rem;
          max-width: 520px;
          width: 100%;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.8);
        }

        .modal-close {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          font-size: 1.1rem;
          color: var(--text-muted);
          cursor: pointer;
        }

        .reserve-modal-title {
          font-family: var(--font-serif);
          font-size: 2rem;
          color: var(--text-primary);
          margin-top: 0.25rem;
          margin-bottom: 0.75rem;
        }

        .reserve-modal-desc {
          font-size: 0.95rem;
          line-height: 1.55;
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        .reserve-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .form-label {
          font-size: var(--text-2xs);
          letter-spacing: 0.15em;
          color: var(--text-muted);
        }

        .form-input {
          background: #100C0A;
          border: 1px solid var(--border-light);
          padding: 0.75rem 1rem;
          border-radius: 4px;
          color: var(--text-primary);
          font-size: var(--text-sm);
          font-family: inherit;
        }

        .form-input:focus {
          border-color: var(--accent-copper);
          outline: none;
        }

        .form-submit-btn {
          margin-top: 1rem;
          width: 100%;
        }

        .booking-success-box {
          text-align: center;
          padding: 2rem 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .success-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--accent-copper);
          color: #FFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
      `}</style>
    </section>
  );
};
