import type { ReactNode } from "react";
import "../styles/Admin/Modal.css";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  widthPx?: number;
}

/** Modal genérico: overlay + tarjeta blanca centrada, cierra con la X o clickeando fuera. */
export default function Modal({ open, title, onClose, children, widthPx = 480 }: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: widthPx }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-card__header">
          <h2>{title}</h2>
          <button type="button" className="modal-card__close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <div className="modal-card__body">{children}</div>
      </div>
    </div>
  );
}