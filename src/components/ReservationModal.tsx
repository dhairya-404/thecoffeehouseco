import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useCursor } from '../context/CursorContext';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '19:00',
    guests: 2,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const { setCursor, resetCursor } = useCursor();

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power3.out' }
      );
      if (nameRef.current) {
        nameRef.current.focus();
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', date: '', time: '19:00', guests: 2 });
        setStatus('idle');
        onClose();
      }, 2000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="reservation-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-title"
    >
      <div
        ref={modalRef}
        className="reservation-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn font-mono"
          onClick={onClose}
          onMouseEnter={() => setCursor('open', 'CLOSE')}
          onMouseLeave={resetCursor}
        >
          ✕ CLOSE
        </button>

        <div className="reservation-header">
          <h2 id="reservation-title" className="display-2 reservation-title">
            RESERVE A TABLE
          </h2>
          <p className="body-text reservation-subtitle">
            Secure your spot at our riverfront café. We hold tables for 15 minutes.
          </p>
        </div>

        <form className="reservation-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="meta-text form-label">NAME</label>
              <input
                ref={nameRef}
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="form-input font-sans"
                placeholder="Your full name"
                onMouseEnter={() => setCursor('default')}
                onMouseLeave={resetCursor}
              />
            </div>

            <div className="form-group">
              <label className="meta-text form-label">EMAIL</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="form-input font-sans"
                placeholder="name@domain.com"
                onMouseEnter={() => setCursor('default')}
                onMouseLeave={resetCursor}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="meta-text form-label">PHONE</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="form-input font-sans"
                placeholder="+91 XXXXX XXXXX"
                onMouseEnter={() => setCursor('default')}
                onMouseLeave={resetCursor}
              />
            </div>

            <div className="form-group">
              <label className="meta-text form-label">DATE</label>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="form-input font-sans"
                onMouseEnter={() => setCursor('default')}
                onMouseLeave={resetCursor}
              />
            </div>
          </div>

          <div className="form-row form-row-wide">
            <div className="form-group">
              <label className="meta-text form-label">TIME</label>
              <div className="time-select-wrapper">
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="form-select font-mono"
                  onMouseEnter={() => setCursor('link')}
                  onMouseLeave={resetCursor}
                >
                  <option value="07:00">07:00</option>
                  <option value="07:30">07:30</option>
                  <option value="08:00">08:00</option>
                  <option value="08:30">08:30</option>
                  <option value="09:00">09:00</option>
                  <option value="09:30">09:30</option>
                  <option value="10:00">10:00</option>
                  <option value="10:30">10:30</option>
                  <option value="11:00">11:00</option>
                  <option value="11:30">11:30</option>
                  <option value="12:00">12:00</option>
                  <option value="12:30">12:30</option>
                  <option value="13:00">13:00</option>
                  <option value="13:30">13:30</option>
                  <option value="14:00">14:00</option>
                  <option value="14:30">14:30</option>
                  <option value="15:00">15:00</option>
                  <option value="15:30">15:30</option>
                  <option value="16:00">16:00</option>
                  <option value="16:30">16:30</option>
                  <option value="17:00">17:00</option>
                  <option value="17:30">17:30</option>
                  <option value="18:00">18:00</option>
                  <option value="18:30">18:30</option>
                  <option value="19:00">19:00</option>
                  <option value="19:30">19:30</option>
                  <option value="20:00">20:00</option>
                  <option value="20:30">20:30</option>
                  <option value="21:00">21:00</option>
                  <option value="21:30">21:30</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="meta-text form-label">GUESTS</label>
              <div className="guest-select-wrapper">
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="form-select font-mono"
                  onMouseEnter={() => setCursor('link')}
                  onMouseLeave={resetCursor}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <option key={num} value={num}>{num} {num === 1 ? 'GUEST' : 'GUESTS'}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="reservation-actions">
            <button
              type="button"
              className="btn-swiss btn-swiss-outline"
              onClick={onClose}
              onMouseEnter={() => setCursor('link')}
              onMouseLeave={resetCursor}
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={status === 'submitting' || status === 'success'}
              className="btn-swiss reservation-submit-btn"
              onMouseEnter={() => setCursor('link')}
              onMouseLeave={resetCursor}
            >
              {status === 'submitting' ? 'PROCESSING...' : status === 'success' ? 'RESERVED!' : 'CONFIRM RESERVATION'}
            </button>
          </div>
        </form>

        {status === 'success' && (
          <div className="reservation-success-banner">
            <h3 className="heading-title">TABLE RESERVED</h3>
            <p className="body-text">A confirmation email has been sent to {formData.email}.</p>
          </div>
        )}
      </div>
    </div>
  );
};
