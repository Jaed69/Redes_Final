import Modal from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Confirmación genérica antes de borrar — la usan todas las vistas CRUD. */
export default function ConfirmDialog({
  open,
  title = "Confirmar eliminación",
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel} widthPx={380}>
      <div className="confirm-dialog">
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            Eliminar
          </button>
        </div>
      </div>
    </Modal>
  );
}