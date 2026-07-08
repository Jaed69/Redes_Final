import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import RequireRole from "./components/RequireRole";
import { api, API_BASE_URL } from "./services/api";

import AppLayout from "./pages/Usuario/Applayout";
import DashboardView from "./pages/Usuario/DashboardView";
import SensorMapView from "./pages/Usuario/SensorMapView";
import SensorReadingsView from "./pages/Usuario/SensorReadingsView";
import DronesView from "./pages/Usuario/DronesView";
import DiseaseDetectionView from "./pages/Usuario/DiseaseDetectionView";
import AlertsNotificationsView from "./pages/Usuario/AlertsNotificationView";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminLayout from "./pages/Admin/AdminLayout";
import DronView from "./pages/Admin/DronView";
import EmpresaView from "./pages/Admin/EmpresaView";
import VinedoView from "./pages/Admin/VinedoView";
import SensorView from "./pages/Admin/SensorView";
import UsuarioView from "./pages/Admin/UsuarioView";
import UmbralView from "./pages/Admin/UmbralView";

import ClienteLayout from "./pages/Cliente/ClienteLayout";
import ClienteDashboard from "./pages/Cliente/ClienteDashboard";
import ClienteAlertas from "./pages/Cliente/ClienteAlertas";
import ClienteReportes from "./pages/Cliente/ClienteReportes";

import TiLayout from "./pages/TI/TiLayout";
import TiCuentas from "./pages/TI/TiCuentas";
import TiDashboard from "./pages/TI/TiDashboard";
import TiSistema from "./pages/TI/TiSistema";

import type {
  Alerta,
  DeteccionEnfermedad,
  Dron,
  Empresa,
  LecturaSensor,
  Notificacion,
  Sensor,
  Usuario,
  Vinedo,
} from "./types/models";

export default function App() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}") as Usuario & {
    empresaId?: string;
    empresaNombre?: string;
  };
  const empresa = { id: usuario.empresaId ?? "", nombre: usuario.empresaNombre ?? "" } as Empresa;
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [backendOnline] = useState(true);

  const [vinedos, setVinedos] = useState<Vinedo[]>([]);
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [lecturas, setLecturas] = useState<LecturaSensor[]>([]);
  const [drones, setDrones] = useState<Dron[]>([]);
  const [detecciones, setDetecciones] = useState<DeteccionEnfermedad[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [notifs, setNotifs] = useState<Notificacion[]>([]);

  const [vinedoActivoId, setVinedoActivoId] = useState<string | null>(null);
  const [sensorSeleccionadoId, setSensorSeleccionadoId] = useState<string | null>(null);

  const [rango, setRango] = useState({ inicio: "2026-06-01", fin: "2026-07-03" });

  // Sincroniza token con localStorage (login/logout en esta o otra pestaña)
  useEffect(() => {
    const sincronizar = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", sincronizar);
    return () => window.removeEventListener("storage", sincronizar);
  }, []);

  useEffect(() => {
    if (!token) return;
    api.get("/vinedos").then((d: any) =>
      setVinedos(
        d.map((v: any) => ({
          id: String(v.idvinedo),
          nombre: v.nombrevinedo,
          ubicacion: v.ubicacion,
          areaHectareas: parseFloat(v.area_hectareas),
          empresaId: String(v.empresa_idempresa),
          empresaNombre: v.nombreempresa,
        }))
      )
    );
  }, [token]);

  useEffect(() => {
    if (!token) return;
    api.get("/sensores").then((d: any) =>
      setSensores(
        d.map((s: any) => ({
          id: String(s.idsensor),
          nombre: s.nombresensor,
          latitud: parseFloat(s.latitud),
          longitud: parseFloat(s.longitud),
          vinedoId: String(s.vinedo_idvinedo),
          vinedoNombre: s.nombrevinedo,
          estado: "sin_datos" as const,
        }))
      )
    );
  }, [token]);

  useEffect(() => {
    if (!token) return;
    api.get("/lecturas").then((d: any) =>
      setLecturas(
        d.map((l: any) => ({
          id: String(l.idlectura),
          sensorId: String(l.sensor_idsensor),
          valor: parseFloat(l.valor),
          fecha: l.fechalectura?.slice(0, 10),
          hora: l.horalectura?.slice(0, 8),
        }))
      )
    );
  }, [token]);

  useEffect(() => {
    if (!token) return;
    api.get("/drones").then(async (d: any) => {
      let imagenes: any[] = [];
      try {
        imagenes = (await api.get("/imagenes")) as any[];
      } catch (_) {
        imagenes = [];
      }

      const dronesMapped: Dron[] = d.map((dr: any) => ({
        id: String(dr.iddron),
        nombre: dr.nombredron,
        vinedoId: String(dr.vinedo_idvinedo),
        vinedoNombre: dr.nombrevinedo,
        imagenes: imagenes
          .filter((im: any) => String(im.dron_iddron) === String(dr.iddron))
          .map((im: any) => ({
            id: String(im.idimagen),
            dronId: String(im.dron_iddron),
            url: `${API_BASE_URL}${im.rutaarchivo}`,
            fecha: im.fechacaptura?.slice(0, 10),
            hora: im.horacaptura?.slice(0, 8),
            latitud: parseFloat(im.latitud),
            longitud: parseFloat(im.longitud),
            anchoPx: im.ancho,
            altoPx: im.alto,
            tamanoArchivo: im.tamanoarchivo,
          })),
      }));
      setDrones(dronesMapped);
    });
  }, [token]);

  useEffect(() => {
    if (!token) return;
    api.get("/detecciones").then((d: any) =>
      setDetecciones(
        d.map((det: any) => ({
          id: String(det.iddeteccion),
          imagenId: String(det.imagen_idimagen),
          enfermedad: det.nombreenfermedad ?? "Desconocida",
          nivelConfianza: parseFloat(det.nivelconfianza),
          fecha: det.fechadeteccion?.slice(0, 10),
          descripcion: det.descripcion,
          imagenUrl: det.rutaarchivo ? `${API_BASE_URL}${det.rutaarchivo}` : undefined,
        }))
      )
    );
  }, [token]);

  useEffect(() => {
    if (!token) return;
    api.get("/alertas").then((d: any) =>
      setAlertas(
        d.map((a: any) => ({
          id: String(a.idalerta),
          tipo: a.tipo,
          estado: a.estado,
          descripcion: a.descripcion,
          vinedoId: String(a.vinedo_idvinedo),
          empresaNombre: a.nombreempresa,
        }))
      )
    );
  }, [token]);

  useEffect(() => {
    if (!token) return;
    api.get("/notificaciones").then((d: any) =>
      setNotifs(
        d.map((n: any) => ({
          id: String(n.idnotificacion),
          mensaje: n.mensaje,
          fecha: n.fechaenvio,
          hora: n.horaenvio,
          usuarioNombre: n.nombreusuario,
          alertaDescripcion: n.alerta,
          leida: false,
        }))
      )
    );
  }, [token]);

  const sensoresDelVinedo = useMemo(
    () => sensores.filter((s) => !vinedoActivoId || s.vinedoId === vinedoActivoId),
    [sensores, vinedoActivoId]
  );

  const dronesDelVinedo = useMemo(
    () => drones.filter((d) => !vinedoActivoId || d.vinedoId === vinedoActivoId),
    [drones, vinedoActivoId]
  );

  const lecturasFiltradas = useMemo(
    () =>
      lecturas.filter(
        (l) =>
          l.sensorId === sensorSeleccionadoId &&
          l.fecha >= rango.inicio &&
          l.fecha <= rango.fin
      ),
    [lecturas, sensorSeleccionadoId, rango]
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* MONITOR */}
        <Route element={<RequireRole roles={["monitor"]} />}>
          <Route
            path="/dashboard"
            element={
              <AppLayout
                usuario={usuario}
                empresa={empresa}
                vinedos={vinedos}
                vinedoActivoId={vinedoActivoId}
                onCambiarVinedo={setVinedoActivoId}
                notificaciones={notifs}
                backendOnline={backendOnline}
              />
            }
          >
            <Route
              index
              element={
                <DashboardView
                  vinedos={vinedos}
                  vinedoActivoId={vinedoActivoId}
                  onSeleccionarVinedo={setVinedoActivoId}
                  sensores={sensoresDelVinedo}
                  alertas={alertas}
                  detecciones={detecciones}
                />
              }
            />

            <Route path="mapa" element={<SensorMapView sensores={sensoresDelVinedo} vinedos={vinedos} />} />

            <Route
              path="lecturas"
              element={
                <SensorReadingsView
                  sensores={sensoresDelVinedo}
                  sensorSeleccionadoId={sensorSeleccionadoId}
                  onCambiarSensor={setSensorSeleccionadoId}
                  fechaInicio={rango.inicio}
                  fechaFin={rango.fin}
                  onCambiarRango={(i, f) => setRango({ inicio: i, fin: f })}
                  lecturas={lecturasFiltradas}
                />
              }
            />

            <Route path="drones" element={<DronesView drones={dronesDelVinedo} />} />

            <Route path="enfermedades" element={<DiseaseDetectionView detecciones={detecciones} />} />

            <Route
              path="alertas"
              element={
                <AlertsNotificationsView
                  alertas={alertas}
                  notificaciones={notifs}
                  onMarcarLeida={(id) =>
                    setNotifs((prev) =>
                      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
                    )
                  }
                  onCambiarEstado={async (id, estado) => {
                    try {
                      await api.put(`/alertas/${id}/estado`, { estado });
                      setAlertas((prev) => prev.map((a) => (a.id === id ? { ...a, estado } : a)));
                    } catch (e) {
                      alert(e instanceof Error ? e.message : "Error al actualizar estado");
                    }
                  }}
                />
              }
            />
          </Route>
        </Route>

        {/* ADMIN */}
        <Route element={<RequireRole roles={["admin"]} />}>
          <Route
            path="/admin"
            element={<AdminLayout usuario={usuario} notificaciones={notifs} backendOnline={backendOnline} />}
          >
            <Route index element={<AdminDashboard />} />
            <Route path="empresas" element={<EmpresaView />} />
            <Route path="vinedos" element={<VinedoView />} />
            <Route path="usuarios" element={<UsuarioView />} />
            <Route path="sensores" element={<SensorView />} />
            <Route path="drones" element={<DronView />} />
            <Route path="umbrales" element={<UmbralView />} />
          </Route>
        </Route>

        {/* CLIENTE */}
        <Route element={<RequireRole roles={["cliente"]} />}>
          <Route path="/cliente" element={<ClienteLayout usuario={usuario} empresa={empresa} />}>
            <Route
              index
              element={
                <ClienteDashboard
                  vinedos={vinedos}
                  sensores={sensores}
                  alertas={alertas}
                  detecciones={detecciones}
                  lecturas={lecturas}
                  notificaciones={notifs}
                  empresaId={empresa.id}
                />
              }
            />
            <Route
              path="alertas"
              element={
                <ClienteAlertas
                  alertas={alertas}
                  empresaId={empresa.id}
                  vinedos={vinedos}
                  notificaciones={notifs}
                />
              }
            />
            <Route
              path="reportes"
              element={<ClienteReportes vinedos={vinedos} alertas={alertas} empresaId={empresa.id} />}
            />
          </Route>
        </Route>

        {/* TI */}
        <Route element={<RequireRole roles={["ti"]} />}>
          <Route path="/ti" element={<TiLayout usuario={usuario} />}>
            <Route index element={<TiDashboard />} />
            <Route path="cuentas" element={<TiCuentas />} />
            <Route path="sistema" element={<TiSistema />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}