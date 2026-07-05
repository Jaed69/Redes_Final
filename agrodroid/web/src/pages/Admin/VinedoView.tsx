import { useState } from "react";
import DataTable, { type DataTableColumn } from "../../components/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import VinedoModal from "../../modals/VinedoModal";
import { empresasMock, vinedosMock } from "../../mockData";
import type { VinedoAdmin } from "../../types/models";
import "../../styles/admin/shared.css";

function nombreEmpresa(empresaId: string): string {
  return empresasMock.find((e) => e.id === empresaId)?.nombre ?? "—";
}

export default function VinedoView() {
  const [vinedos, setVinedos] = useState<VinedoAdmin[]>(vinedosMock);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<VinedoAdmin | null>(null);
  const [aEliminar, setAEliminar] = useState<VinedoAdmin | null>(null);

  const columnas: DataTableColumn<VinedoAdmin>[] = [
    { key: "nombre", label: "Nombre", render: (v) => v.nombre },
    { key: "empresaNombre", label: "Empresa", render: (v) => v.empresaNombre },
    {
      key: "ubicacion",
      label: "Ubicación",
      render: (v) => (
        <span className="mono-cell">
          {v.latitud.toFixed(4)}, {v.longitud.toFixed(4)}
        </span>
      ),
    },
    { key: "areaHectareas", label: "Área (ha)", render: (v) => v.areaHectareas.toFixed(2) },
    {
      key: "estado",
      label: "Estado",
      render: (v) => (
        <span className={`estado-pill ${v.estado === "Activo" ? "normal" : "offline"}`}>{v.estado}</span>
      ),
    },
  ];

  const handleNuevo = () => {
    setEditando(null);
    setModalAbierto(true);
  };

  const handleEditar = (vinedo: VinedoAdmin) => {
    setEditando(vinedo);
    setModalAbierto(true);
  };

  const handleGuardar = (data: Omit<VinedoAdmin, "id" | "empresaNombre">) => {
    const empresaNombre = nombreEmpresa(data.empresaId);
    if (editando) {
      setVinedos((prev) =>
        prev.map((v) => (v.id === editando.id ? { ...editando, ...data, empresaNombre } : v))
      );
    } else {
      setVinedos((prev) => [...prev, { ...data, empresaNombre, id: crypto.randomUUID() }]);
    }
    setModalAbierto(false);
  };

  const handleEliminarConfirmado = () => {
    if (aEliminar) setVinedos((prev) => prev.filter((v) => v.id !== aEliminar.id));
    setAEliminar(null);
  };

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1>Viñedos</h1>
          <p className="view-header__sub">Gestiona los viñedos de todas las empresas</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleNuevo}>
          + Nuevo viñedo
        </button>
      </div>

      <DataTable
        columns={columnas}
        rows={vinedos}
        searchKeys={["nombre", "empresaNombre"]}
        onEdit={handleEditar}
        onDelete={setAEliminar}
        emptyMessage="No hay viñedos registrados."
      />

      <VinedoModal
        open={modalAbierto}
        vinedo={editando}
        onGuardar={handleGuardar}
        onClose={() => setModalAbierto(false)}
      />

      <ConfirmDialog
        open={aEliminar !== null}
        message={`¿Seguro que quieres eliminar el viñedo "${aEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleEliminarConfirmado}
        onCancel={() => setAEliminar(null)}
      />
    </div>
  );
}