import { useState } from "react";
import DataTable, { type DataTableColumn } from "../../components/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import DronModal from "../../modals/DronModal";
import { dronesMock, vinedosMock } from "../../mockData";
import type { DronAdmin } from "../../types/models";
import "../../styles/admin/shared.css";

function nombreVinedo(vinedoId: string): string {
  return vinedosMock.find((v) => v.id === vinedoId)?.nombre ?? "—";
}

const ESTADO_CLASE: Record<DronAdmin["estado"], string> = {
  Disponible: "normal",
  "En vuelo": "en_proceso",
  Mantenimiento: "critico",
};

export default function DronView() {
  const [drones, setDrones] = useState<DronAdmin[]>(dronesMock);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<DronAdmin | null>(null);
  const [aEliminar, setAEliminar] = useState<DronAdmin | null>(null);

  const columnas: DataTableColumn<DronAdmin>[] = [
    { key: "codigo", label: "Código", render: (d) => <span className="mono-cell">{d.codigo}</span> },
    { key: "modelo", label: "Modelo", render: (d) => d.modelo },
    { key: "vinedoNombre", label: "Viñedo", render: (d) => d.vinedoNombre },
    {
      key: "estado",
      label: "Estado",
      render: (d) => <span className={`estado-pill ${ESTADO_CLASE[d.estado]}`}>{d.estado}</span>,
    },
    {
      key: "bateria",
      label: "Batería",
      render: (d) => (
        <div className="battery-cell">
          <div className="battery-cell__bar">
            <div
              className="battery-cell__fill"
              style={{
                width: `${d.bateria}%`,
                background: d.bateria < 25 ? "var(--critical)" : d.bateria < 50 ? "var(--warning)" : "var(--success)",
              }}
            />
          </div>
          <span className="mono-cell">{d.bateria}%</span>
        </div>
      ),
    },
  ];

  const handleNuevo = () => {
    setEditando(null);
    setModalAbierto(true);
  };

  const handleEditar = (dron: DronAdmin) => {
    setEditando(dron);
    setModalAbierto(true);
  };

  const handleGuardar = (data: Omit<DronAdmin, "id" | "vinedoNombre" | "bateria">) => {
    const vinedoNombre = nombreVinedo(data.vinedoId);
    if (editando) {
      setDrones((prev) => prev.map((d) => (d.id === editando.id ? { ...editando, ...data, vinedoNombre } : d)));
    } else {
      setDrones((prev) => [...prev, { ...data, vinedoNombre, bateria: 100, id: crypto.randomUUID() }]);
    }
    setModalAbierto(false);
  };

  const handleEliminarConfirmado = () => {
    if (aEliminar) setDrones((prev) => prev.filter((d) => d.id !== aEliminar.id));
    setAEliminar(null);
  };

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1>Drones</h1>
          <p className="view-header__sub">Gestiona la flota de drones por viñedo</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleNuevo}>
          + Nuevo dron
        </button>
      </div>

      <DataTable
        columns={columnas}
        rows={drones}
        searchKeys={["codigo", "modelo", "vinedoNombre"]}
        onEdit={handleEditar}
        onDelete={setAEliminar}
        emptyMessage="No hay drones registrados."
      />

      <DronModal
        open={modalAbierto}
        dron={editando}
        onGuardar={handleGuardar}
        onClose={() => setModalAbierto(false)}
      />

      <ConfirmDialog
        open={aEliminar !== null}
        message={`¿Seguro que quieres eliminar el dron "${aEliminar?.codigo}"? Esta acción no se puede deshacer.`}
        onConfirm={handleEliminarConfirmado}
        onCancel={() => setAEliminar(null)}
      />
    </div>
  );
}