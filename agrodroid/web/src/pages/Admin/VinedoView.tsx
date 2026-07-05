import { useEffect, useState } from "react";
import DataTable, { type DataTableColumn } from "../../components/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import VinedoModal from "../../modals/VinedoModal";
import { api } from "../../services/api";
import type { EmpresaAdmin, VinedoAdmin } from "../../types/models";
import "../../styles/Admin/Shared.css";

type ApiVinedo = {
  idvinedo: number;
  nombrevinedo: string;
  ubicacion: string;
  area_hectareas: string;
  empresa_idempresa: number;
  nombreempresa: string;
};

const mapVinedo = (a: ApiVinedo): VinedoAdmin => ({
  id: String(a.idvinedo),
  nombre: a.nombrevinedo,
  ubicacion: a.ubicacion,
  areaHectareas: parseFloat(a.area_hectareas),
  empresaId: String(a.empresa_idempresa),
  empresaNombre: a.nombreempresa,
});

export default function VinedoView() {
  const [vinedos, setVinedos] = useState<VinedoAdmin[]>([]);
  const [empresas, setEmpresas] = useState<EmpresaAdmin[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<VinedoAdmin | null>(null);
  const [aEliminar, setAEliminar] = useState<VinedoAdmin | null>(null);

  const cargar = async () => {
    try {
      const [vData, eData] = await Promise.all([
        api.get("/vinedos") as Promise<ApiVinedo[]>,
        api.get("/empresas") as Promise<{ idempresa: number; nombreempresa: string }[]>,
      ]);
      setVinedos(vData.map(mapVinedo));
      setEmpresas(
        eData.map((e) => ({ id: String(e.idempresa), nombre: e.nombreempresa, ruc: "", direccion: "" }))
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const columnas: DataTableColumn<VinedoAdmin>[] = [
    { key: "nombre", label: "Nombre", render: (v) => v.nombre },
    { key: "empresaNombre", label: "Empresa", render: (v) => v.empresaNombre },
    { key: "ubicacion", label: "Ubicación", render: (v) => v.ubicacion },
    { key: "areaHectareas", label: "Área (ha)", render: (v) => v.areaHectareas.toFixed(2) },
  ];

  const handleNueva = () => {
    setEditando(null);
    setModalAbierto(true);
  };

  const handleEditar = (vinedo: VinedoAdmin) => {
    setEditando(vinedo);
    setModalAbierto(true);
  };

  const handleGuardar = async (data: {
    nombre: string;
    ubicacion: string;
    areaHectareas: number;
    empresaId: string;
  }) => {
    try {
      const body = {
        nombreVinedo: data.nombre,
        ubicacion: data.ubicacion,
        area_hectareas: data.areaHectareas,
        Empresa_idEmpresa: Number(data.empresaId),
      };
      if (editando) {
        await api.put(`/vinedos/${editando.id}`, body);
      } else {
        await api.post("/vinedos", body);
      }
      await cargar();
      setModalAbierto(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al guardar viñedo");
    }
  };

  const handleEliminarConfirmado = async () => {
    if (!aEliminar) return;
    try {
      await api.del(`/vinedos/${aEliminar.id}`);
      await cargar();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar viñedo");
    }
    setAEliminar(null);
  };

  return (
    <div className="admin-view">
      <div className="admin-view__header">
        <div>
          <h1>Viñedos</h1>
          <p className="view-header__sub">Gestiona los viñedos de todas las empresas</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={handleNueva}>
          + Nuevo viñedo
        </button>
      </div>

      <DataTable
        columns={columnas}
        rows={vinedos}
        searchKeys={["nombre", "empresaNombre", "ubicacion"]}
        onEdit={handleEditar}
        onDelete={setAEliminar}
        emptyMessage="No hay viñedos registrados."
      />

      <VinedoModal
        open={modalAbierto}
        vinedo={editando}
        empresas={empresas}
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