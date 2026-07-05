import { useEffect, useState } from "react";
import DataTable, { type DataTableColumn } from "../../components/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import SensorModal from "../../modals/SensorModal";
import { api } from "../../services/api";
import type { SensorAdmin, VinedoAdmin } from "../../types/models";
import "../../styles/Admin/Shared.css";

type ApiSensor = {
  idsensor: number;
  nombresensor: string;
  latitud: string;
  longitud: string;
  vinedo_idvinedo: number;
  nombrevinedo: string;
};

const mapSensor = (a: ApiSensor): SensorAdmin => ({
  id: String(a.idsensor),
  nombre: a.nombresensor,
  vinedoId: String(a.vinedo_idvinedo),
  vinedoNombre: a.nombrevinedo,
  latitud: parseFloat(a.latitud),
  longitud: parseFloat(a.longitud),
});

type ApiVinedo = {
  idvinedo: number;
  nombrevinedo: string;
  ubicacion: string;
  area_hectareas: string;
  empresa_idempresa: number;
  nombreempresa: string;
};

export default function SensorView() {
  const [sensores, setSensores] = useState<SensorAdmin[]>([]);
  const [vinedos, setVinedos] = useState<VinedoAdmin[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<SensorAdmin | null>(null);
  const [aEliminar, setAEliminar] = useState<SensorAdmin | null>(null);

  const cargar = async () => {
    try {
      const [sData, vData] = await Promise.all([
        api.get("/sensores") as Promise<ApiSensor[]>,
        api.get("/vinedos") as Promise<ApiVinedo[]>,
      ]);
      setSensores(sData.map(mapSensor));
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

  const columnas: DataTableColumn<SensorAdmin>[] = [
    { key: "nombre", label: "Nombre", render: (s) => s.nombre },
    { key: "vinedoNombre", label: "Viñedo", render: (s) => s.vinedoNombre },
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

  const handleGuardar = async (data: {
    nombre: string;
    vinedoId: string;
    latitud: number;
    longitud: number;
  }) => {
    try {
      const body = {
        nombreSensor: data.nombre,
        longitud: data.longitud,
        latitud: data.latitud,
        Vinedo_idVinedo: Number(data.vinedoId),
      };
      if (editando) {
        await api.put(`/sensores/${editando.id}`, body);
      } else {
        await api.post("/sensores", body);
      }
      await cargar();
      setModalAbierto(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al guardar sensor");
    }
  };

  const handleEliminarConfirmado = async () => {
    if (!aEliminar) return;
    try {
      await api.del(`/sensores/${aEliminar.id}`);
      await cargar();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar sensor");
    }
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
        searchKeys={["nombre", "vinedoNombre"]}
        onEdit={handleEditar}
        onDelete={setAEliminar}
        emptyMessage="No hay sensores registrados."
      />

      <SensorModal
        open={modalAbierto}
        sensor={editando}
        vinedos={vinedos}
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