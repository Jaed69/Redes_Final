import { useState } from "react";
import DataTable, { type DataTableColumn } from "../../components/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import SensorModal from "../../modals/SensorModal";
import { sensoresMock, vinedosMock } from "../../mockData";
import type { SensorAdmin } from "../../types/models";
import "../../styles/admin/shared.css";

function nombreVinedo(vinedoId: string): string {
  return vinedosMock.find((v) => v.id === vinedoId)?.nombre ?? "—";
}

export default function SensorView() {
  const [sensores, setSensores] = useState<SensorAdmin[]>(sensoresMock);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<SensorAdmin | null>(null);
  const [aEliminar, setAEliminar] = useState<SensorAdmin | null>(null);

  const columnas: DataTableColumn<SensorAdmin>[] = [
    { key: "nombre", label: "Nombre", render: (s) => s.nombre },
    { key: "tipo", label: "Tipo", render: (s) => s.tipo },
    { key: "vinedoNombre", label: "Viñedo", render: (s) => s.vinedoNombre },
    {
      key: "estado",
      label: "Estado",
      render: (s) => (
        <span className={`estado-pill ${s.estado === "Activo" ? "normal" : "offline"}`}>{s.estado}</span>
      ),
    },
    { key: "latitud", label: "Latitud", render: (s) => <span className="mono-cell">{s.latitud.toFixed(4)}</span> },
    { key: "longitud", label: "Longitud", render: (s) => <span className="mono-cell">{s.longitud.toFixed(4)}</span> },
  ];

  const handleNuevo = () => {
    setEditando(null);
    setModalAbierto(true);
  };

  const handleEditar = (sensor: SensorAdmin) => {
    setEditando(sensor);
    setModalAbierto(true);
  };

  const handleGuardar = (data: Omit<SensorAdmin, "id" | "vinedoNombre" | "estado">) => {
    const vinedoNombre = nombreVinedo(data.vinedoId);
    if (editando) {
      setSensores((prev) =>
        prev.map((s) => (s.id === editando.id ? { ...editando, ...data, vinedoNombre } : s))
      );
    } else {
      setSensores((prev) => [...prev, { ...data, vinedoNombre, estado: "Activo", id: crypto.randomUUID() }]);
    }
    setModalAbierto(false);
  };

  const handleEliminarConfirmado = () => {
    if (aEliminar) setSensores((prev) => prev.filter((s) => s.id !== aEliminar.id));
    setAEliminar(null);
  };

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1>Sensores</h1>
          <p className="view-header__sub">Gestiona los sensores desplegados en los viñedos</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleNuevo}>
          + Nuevo sensor
        </button>
      </div>

      <DataTable
        columns={columnas}
        rows={sensores}
        searchKeys={["nombre", "vinedoNombre", "tipo"]}
        onEdit={handleEditar}
        onDelete={setAEliminar}
        emptyMessage="No hay sensores registrados."
      />

      <SensorModal
        open={modalAbierto}
        sensor={editando}
        onGuardar={handleGuardar}
        onClose={() => setModalAbierto(false)}
      />

      <ConfirmDialog
        open={aEliminar !== null}
        message={`¿Seguro que quieres eliminar el sensor "${aEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleEliminarConfirmado}
        onCancel={() => setAEliminar(null)}
      />
    </div>
  );
}