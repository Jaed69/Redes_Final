import { useEffect, useState } from "react";
import DataTable, { type DataTableColumn } from "../../components/DataTable";
import ConfirmDialog from "../../components/ConfirmDialog";
import UmbralModal from "../../modals/UmbralModal";
import { api } from "../../services/api";
import type { SensorAdmin, UmbralAdmin } from "../../types/models";
import "../../styles/Admin/Shared.css";

type ApiUmbral = {
  idumbral: number;
  valorminimo: string;
  valormaximo: string;
  descripcion: string;
  sensor_idsensor: number;
};

const mapUmbral = (a: ApiUmbral, sensorNombre: string): UmbralAdmin => ({
  id: String(a.idumbral),
  sensorId: String(a.sensor_idsensor),
  sensorNombre,
  valorMinimo: parseFloat(a.valorminimo),
  valorMaximo: parseFloat(a.valormaximo),
  descripcion: a.descripcion,
});

export default function UmbralView() {
  const [umbrales, setUmbrales] = useState<UmbralAdmin[]>([]);
  const [sensores, setSensores] = useState<SensorAdmin[]>([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState<UmbralAdmin | null>(null);
  const [aEliminar, setAEliminar] = useState<UmbralAdmin | null>(null);

  const cargar = async () => {
    try {
      const [uData, sData] = await Promise.all([
        api.get("/umbrales") as Promise<ApiUmbral[]>,
        api.get("/sensores") as Promise<{
          idsensor: number;
          nombresensor: string;
          latitud: string;
          longitud: string;
          vinedo_idvinedo: number;
          nombrevinedo: string;
        }[]>,
      ]);
      const sensoresMap = new Map(sData.map((s) => [String(s.idsensor), s.nombresensor]));
      setSensores(
        sData.map((s) => ({
          id: String(s.idsensor),
          nombre: s.nombresensor,
          vinedoId: String(s.vinedo_idvinedo),
          vinedoNombre: s.nombrevinedo,
          latitud: parseFloat(s.latitud),
          longitud: parseFloat(s.longitud),
        }))
      );
      setUmbrales(uData.map((u) => mapUmbral(u, sensoresMap.get(String(u.sensor_idsensor)) ?? "—")));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const columnas: DataTableColumn<UmbralAdmin>[] = [
    { key: "sensorNombre", label: "Sensor", render: (u) => u.sensorNombre },
    { key: "descripcion", label: "Descripción", render: (u) => u.descripcion },
    { key: "valorMinimo", label: "Valor mínimo", render: (u) => <span className="mono-cell">{u.valorMinimo}</span> },
    { key: "valorMaximo", label: "Valor máximo", render: (u) => <span className="mono-cell">{u.valorMaximo}</span> },
  ];

  const handleNuevo = () => {
    setEditando(null);
    setModalAbierto(true);
  };

  const handleEditar = (umbral: UmbralAdmin) => {
    setEditando(umbral);
    setModalAbierto(true);
  };

  const handleGuardar = async (data: {
    sensorId: string;
    valorMinimo: number;
    valorMaximo: number;
    descripcion: string;
  }) => {
    try {
      if (editando) {
        await api.put(`/umbrales/${editando.id}`, {
          valorMinimo: data.valorMinimo,
          valorMaximo: data.valorMaximo,
          descripcion: data.descripcion,
        });
      } else {
        await api.post("/umbrales", {
          valorMinimo: data.valorMinimo,
          valorMaximo: data.valorMaximo,
          descripcion: data.descripcion,
          Sensor_idSensor: Number(data.sensorId),
        });
      }
      await cargar();
      setModalAbierto(false);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al guardar umbral");
    }
  };

  const handleEliminarConfirmado = async () => {
    if (!aEliminar) return;
    try {
      await api.del(`/umbrales/${aEliminar.id}`);
      await cargar();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error al eliminar umbral");
    }
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
        searchKeys={["sensorNombre", "descripcion"]}
        onEdit={handleEditar}
        onDelete={setAEliminar}
        emptyMessage="No hay umbrales configurados."
      />

      <UmbralModal
        open={modalAbierto}
        umbral={editando}
        sensores={sensores}
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