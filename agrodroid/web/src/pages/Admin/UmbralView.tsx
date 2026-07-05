import { useState } from "react";
import DataTable, { type DataTableColumn } from "../../components/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import UmbralModal from "../../modals/UmbralModal";
import { sensoresMock, umbralesMock } from "../../mockData";
import type { UmbralAdmin } from "../../types/models";
import "../../styles/admin/shared.css";

function nombreSensor(sensorId: string): string {
  return sensoresMock.find((s) => s.id === sensorId)?.nombre ?? "—";
}

export default function UmbralView() {
  const [umbrales, setUmbrales] = useState<UmbralAdmin[]>(umbralesMock);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<UmbralAdmin | null>(null);
  const [aEliminar, setAEliminar] = useState<UmbralAdmin | null>(null);

  const columnas: DataTableColumn<UmbralAdmin>[] = [
    { key: "sensorNombre", label: "Sensor", render: (u) => u.sensorNombre },
    { key: "variable", label: "Variable", render: (u) => u.variable },
    { key: "valorMinimo", label: "Valor mínimo", render: (u) => <span className="mono-cell">{u.valorMinimo}</span> },
    { key: "valorMaximo", label: "Valor máximo", render: (u) => <span className="mono-cell">{u.valorMaximo}</span> },
    {
      key: "estado",
      label: "Estado",
      render: (u) => (
        <span className={`estado-pill ${u.estado === "Activo" ? "normal" : "offline"}`}>{u.estado}</span>
      ),
    },
  ];

  const handleNuevo = () => {
    setEditando(null);
    setModalAbierto(true);
  };

  const handleEditar = (umbral: UmbralAdmin) => {
    setEditando(umbral);
    setModalAbierto(true);
  };

  const handleGuardar = (data: Omit<UmbralAdmin, "id" | "sensorNombre" | "estado">) => {
    const sensorNombre = nombreSensor(data.sensorId);
    if (editando) {
      setUmbrales((prev) =>
        prev.map((u) => (u.id === editando.id ? { ...editando, ...data, sensorNombre } : u))
      );
    } else {
      setUmbrales((prev) => [...prev, { ...data, sensorNombre, estado: "Activo", id: crypto.randomUUID() }]);
    }
    setModalAbierto(false);
  };

  const handleEliminarConfirmado = () => {
    if (aEliminar) setUmbrales((prev) => prev.filter((u) => u.id !== aEliminar.id));
    setAEliminar(null);
  };

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1>Umbrales</h1>
          <p className="view-header__sub">Administra los límites mínimo/máximo de cada sensor</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleNuevo}>
          + Nuevo umbral
        </button>
      </div>

      <DataTable
        columns={columnas}
        rows={umbrales}
        searchKeys={["sensorNombre", "variable"]}
        onEdit={handleEditar}
        onDelete={setAEliminar}
        emptyMessage="No hay umbrales configurados."
      />

      <UmbralModal
        open={modalAbierto}
        umbral={editando}
        onGuardar={handleGuardar}
        onClose={() => setModalAbierto(false)}
      />

      <ConfirmDialog
        open={aEliminar !== null}
        message={`¿Seguro que quieres eliminar el umbral de "${aEliminar?.sensorNombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleEliminarConfirmado}
        onCancel={() => setAEliminar(null)}
      />
    </div>
  );
}