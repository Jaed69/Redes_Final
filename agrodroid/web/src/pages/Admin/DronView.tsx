import { useEffect, useState } from "react";
import DataTable, { type DataTableColumn } from "../../components/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import DronModal from "../../modals/DronModal";
import { api } from "../../services/api";
import type { DronAdmin, VinedoAdmin } from "../../types/models";
import "../../styles/Admin/Shared.css";

type ApiDron = {
  iddron: number;
  nombredron: string;
  vinedo_idvinedo: number;
  nombrevinedo: string;
};

const mapDron = (a: ApiDron): DronAdmin => ({
  id: String(a.iddron),
  nombre: a.nombredron,
  vinedoId: String(a.vinedo_idvinedo),
  vinedoNombre: a.nombrevinedo,
});

type ApiVinedo = {
  idvinedo: number;
  nombrevinedo: string;
  ubicacion: string;
  area_hectareas: string;
  empresa_idempresa: number;
  nombreempresa: string;
};

export default function DronView() {
  const [drones, setDrones] = useState<DronAdmin[]>([]);
  const [vinedos, setVinedos] = useState<VinedoAdmin[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<DronAdmin | null>(null);
  const [aEliminar, setAEliminar] = useState<DronAdmin | null>(null);

  const cargar = async () => {
    try {
      const [dData, vData] = await Promise.all([
        api.get("/drones") as Promise<ApiDron[]>,
        api.get("/vinedos") as Promise<ApiVinedo[]>,
      ]);
      setDrones(dData.map(mapDron));
      setVinedos(
        vData.map((v) => ({
          id: String(v.idvinedo),
          nombre: v.nombrevinedo,
          ubicacion: v.ubicacion,
          areaHectareas: parseFloat(v.area_hectareas),
          empresaId: String(v.empresa_idempresa),
          empresaNombre: v.nombreempresa,
        }))
      );
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const columnas: DataTableColumn<DronAdmin>[] = [
    { key: "nombre", label: "Nombre", render: (d) => <span className="mono-cell">{d.nombre}</span> },
    { key: "vinedoNombre", label: "Viñedo", render: (d) => d.vinedoNombre },
  ];

  const handleNuevo = () => {
    setEditando(null);
    setModalAbierto(true);
  };

  const handleEditar = (dron: DronAdmin) => {
    setEditando(dron);
    setModalAbierto(true);
  };

  const handleGuardar = async (data: { nombre: string; vinedoId: string }) => {
    try {
      const body = { nombreDron: data.nombre, Vinedo_idVinedo: Number(data.vinedoId) };
      if (editando) {
        await api.put(`/drones/${editando.id}`, body);
      } else {
        await api.post("/drones", body);
      }
      await cargar();
      setModalAbierto(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al guardar dron");
    }
  };

  const handleEliminarConfirmado = async () => {
    if (!aEliminar) return;
    try {
      await api.del(`/drones/${aEliminar.id}`);
      await cargar();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar dron");
    }
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
        searchKeys={["nombre", "vinedoNombre"]}
        onEdit={handleEditar}
        onDelete={setAEliminar}
        emptyMessage="No hay drones registrados."
      />

      <DronModal
        open={modalAbierto}
        dron={editando}
        vinedos={vinedos}
        onGuardar={handleGuardar}
        onClose={() => setModalAbierto(false)}
      />

      <ConfirmDialog
        open={aEliminar !== null}
        message={`¿Seguro que quieres eliminar el dron "${aEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleEliminarConfirmado}
        onCancel={() => setAEliminar(null)}
      />
    </div>
  );
}