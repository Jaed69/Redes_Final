import { useEffect, useState } from "react";
import DataTable, { type DataTableColumn } from "../../components/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import EmpresaModal from "../../modals/EmpresaModal";
import { api } from "../../services/api";
import type { EmpresaAdmin } from "../../types/models";
import "../../styles/Admin/Shared.css";

type ApiEmpresa = { idempresa: number; ruc: string; nombreempresa: string; direccion: string };

const mapEmpresa = (a: ApiEmpresa): EmpresaAdmin => ({
  id: String(a.idempresa),
  nombre: a.nombreempresa,
  ruc: a.ruc,
  direccion: a.direccion,
});

export default function EmpresaView() {
  const [empresas, setEmpresas] = useState<EmpresaAdmin[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<EmpresaAdmin | null>(null);
  const [aEliminar, setAEliminar] = useState<EmpresaAdmin | null>(null);

  const cargar = async () => {
    try {
      const data = (await api.get("/empresas")) as ApiEmpresa[];
      setEmpresas(data.map(mapEmpresa));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const columnas: DataTableColumn<EmpresaAdmin>[] = [
    { key: "nombre", label: "Nombre", render: (e) => e.nombre },
    { key: "ruc", label: "RUC", render: (e) => <span className="mono-cell">{e.ruc}</span> },
    { key: "direccion", label: "Dirección", render: (e) => e.direccion },
  ];

  const handleNueva = () => {
    setEditando(null);
    setModalAbierto(true);
  };

  const handleEditar = (empresa: EmpresaAdmin) => {
    setEditando(empresa);
    setModalAbierto(true);
  };

  const handleGuardar = async (data: { nombre: string; ruc: string; direccion: string }) => {
    try {
      if (editando) {
        await api.put(`/empresas/${editando.id}`, {
          ruc: data.ruc,
          nombreEmpresa: data.nombre,
          direccion: data.direccion,
        });
      } else {
        await api.post("/empresas", {
          ruc: data.ruc,
          nombreEmpresa: data.nombre,
          direccion: data.direccion,
        });
      }
      await cargar();
      setModalAbierto(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al guardar empresa");
    }
  };

  const handleEliminarConfirmado = async () => {
    if (!aEliminar) return;
    try {
      await api.del(`/empresas/${aEliminar.id}`);
      await cargar();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar empresa");
    }
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
        searchKeys={["nombre", "ruc", "direccion"]}
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