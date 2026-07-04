import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

import AppLayout from "./pages/Usuario/Applayout";
import DashboardView from "./pages/Usuario/DashboardView";
import SensorMapView from "./pages/Usuario/SensorMapView";
import SensorReadingsView from "./pages/Usuario/SensorReadingsView";
import DronesView from "./pages/Usuario/DronesView";
import DiseaseDetectionView from "./pages/Usuario/DiseaseDetectionView";
import AlertsNotificationsView from "./pages/Usuario/AlertsNotificationView";

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
  // =========================
  // AUTH / STATIC
  // =========================
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}") as Usuario;

  const empresa = {} as Empresa;

  const [backendOnline] = useState(true);

  // =========================
  // DATA STATE
  // =========================
  const [vinedos, setVinedos] = useState<Vinedo[]>([]);
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [lecturas, setLecturas] = useState<LecturaSensor[]>([]);
  const [drones, setDrones] = useState<Dron[]>([]);
  const [detecciones, setDetecciones] = useState<DeteccionEnfermedad[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [notifs, setNotifs] = useState<Notificacion[]>([]);

  // =========================
  // UI STATE
  // =========================
  const [vinedoActivoId, setVinedoActivoId] = useState<string | null>(null);
  const [sensorSeleccionadoId, setSensorSeleccionadoId] = useState<string | null>(null);

  const [rango, setRango] = useState({
    inicio: "2026-06-01",
    fin: "2026-07-03",
  });

  // =========================
  // FETCH HELPERS
  // =========================
  const API = "http://localhost:3000";

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    fetch(`${API}/vinedos`)
      .then((r) => r.json())
      .then((data) =>
        setVinedos(
          data.map((v: any) => ({
            id: String(v.idvinedo),
            nombre: v.nombrevinedo,
            ubicacion: v.ubicacion,
            areaHectareas: parseFloat(v.area_hectareas),
          }))
        )
      );
  }, []);

  useEffect(() => {
    fetch(`${API}/sensores`)
      .then((r) => r.json())
      .then((data) =>
        setSensores(
          data.map((s: any) => ({
            id: String(s.idsensor),
            nombre: s.nombresensor,
            latitud: parseFloat(s.latitud),
            longitud: parseFloat(s.longitud),
            vinedoNombre: s.nombrevinedo,
            estado: "normal",
          }))
        )
      );
  }, []);

  useEffect(() => {
    fetch(`${API}/alertas`, { headers: authHeader() })
      .then((r) => r.json())
      .then((data) =>
        setAlertas(
          data.map((a: any) => ({
            id: String(a.idalerta),
            tipo: a.tipo,
            estado: a.estado,
            descripcion: a.descripcion,
          }))
        )
      );
  }, []);

  useEffect(() => {
    fetch(`${API}/notificaciones`, { headers: authHeader() })
      .then((r) => r.json())
      .then((data) =>
        setNotifs(
          data.map((n: any) => ({
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
  }, []);

  // =========================
  // DERIVED DATA
  // =========================
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

  // =========================
  // ROUTES
  // =========================
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* APP */}
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

          <Route path="drones" element={<DronesView drones={dronesDelVinedo} vinedos={vinedos} />} />

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
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}