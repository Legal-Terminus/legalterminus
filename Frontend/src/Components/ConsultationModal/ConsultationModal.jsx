import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import ConsultationForm from '../ConsultationForm/ConsultationForm';
import './ConsultationModal.css';

/**
 * #133 — a thin popup wrapper that shows the EXISTING ConsultationForm in a
 * centered overlay. It adds nothing to the form itself (same fields, same API,
 * same `source` lead-tracking) — it only presents it as a dismissible popup so a
 * "Book Free Consultation" button can open it.
 *
 * Props:
 *   open     {boolean}   - whether the popup is shown
 *   onClose  {function}  - called on backdrop click, ✕, or Escape
 *   source   {string}    - passed straight through to ConsultationForm (which page)
 *   title    {string}    - optional, forwarded to ConsultationForm
 *   subtitle {string}    - optional, forwarded to ConsultationForm
 */
const ConsultationModal = ({ open, onClose, source, title, subtitle }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  // Rendered through a PORTAL to <body>: the pricing sections animate in with CSS
  // transforms, and a transformed ancestor turns position:fixed into "fixed within
  // that ancestor" — which slid the popup under the sticky navbar and shrank the
  // backdrop. A body-level portal (plus a z-index above the navbar's 9999) keeps
  // the overlay glued to the real viewport on every page.
  return createPortal(
    <div
      className="consult-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="consult-modal-dialog" role="dialog" aria-modal="true">
        <button className="consult-modal-close" onClick={onClose} aria-label="Close">✕</button>
        <ConsultationForm
          source={source}
          {...(title ? { title } : {})}
          {...(subtitle ? { subtitle } : {})}
        />
      </div>
    </div>,
    document.body,
  );
};

export default ConsultationModal;
