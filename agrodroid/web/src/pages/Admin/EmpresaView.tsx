import { useState } from "react";
import DataTable, { type DataTableColumn } from "../../components/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import EmpresaModal from "../../modals/EmpresaModal";
import { empresasMock } from "../../mockData";
import type { EmpresaAdmin } from "../../types/models";
import "../../styles/admin/shared.css";

/** Vista CRUD de Empresas. Reemplaza el useState inicial por tu fetch real cuando conectes la API. */
export default function EmpresaView() {
  const [empresas, setEmpresas] = useState<EmpresaAdmin[]>(empresasMock);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<EmpresaAdmin | null>(null);
  const [aEliminar, setAEliminar] = useState<EmpresaAdmin | null>(null);

  const columnas: DataTableColumn<EmpresaAdmin>[] = [
    { key: "nombre", label: "Nombre", render: (e) => e.nombre },
    { key: "ruc", label: "RUC", render: (e) => <span className="mono-cell">{e.ruc}</span> },
    { key: "direccion", label: "Dirección", render: (e) => e.direccion },
    { key: "responsable", label: "Responsable", render: (e) => e.responsable },
    {
      key: "estado",
      label: "Estado",
      render: (e) => (
        <span className={`estado-pill ${e.estado === "Activo" ? "normal" : "offline"}`}>{e.estado}</span>
      ),
    },
  ];

  const handleNueva = () => {
    setEditando(null);
    setModalAbierto(true);
  };

  const handleEditar = (empresa: EmpresaAdmin) => {
    setEditando(empresa);
    setModalAbierto(true);
  };

  const handleGuardar = (data: Omit<EmpresaAdmin, "id">) => {
    if (editando) {
      setEmpresas((prev) => prev.map((e) => (e.id === editando.id ? { ...editando, ...data } : e)));
    } else {
      setEmpresas((prev) => [...prev, { ...data, id: crypto.randomUUID() }]);
    }
    setModalAbierto(false);
  };

  const handleEliminarConfirmado = () => {
    if (aEliminar) setEmpresas((prev) => prev.filter((e) => e.id !== aEliminar.id));
    setAEliminar(null);
  };

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1>Empresas</h1>
          <p className="view-header__sub">Gestiona las empresas registradas en la plataforma</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleNueva}>
          + Nueva empresa
        </button>
      </div>

      <DataTable
        columns={columnas}
        rows={empresas}
        searchKeys={["nombre", "ruc", "responsable"]}
        onEdit={handleEditar}
        onDelete={setAEliminar}
        emptyMessage="No hay empresas registradas."
      />

      <EmpresaModal
        open={modalAbierto}
        empresa={editando}
        onGuardar={handleGuardar}
        onClose={() => setModalAbierto(false)}
      />

      <ConfirmDialog
        open={aEliminar !== null}
        message={`¿Seguro que quieres eliminar la empresa "${aEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleEliminarConfirmado}
        onCancel={() => setAEliminar(null)}
      />
    </div>
  );
}