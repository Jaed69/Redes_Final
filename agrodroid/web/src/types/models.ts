

// ============================================================
// A. Tipos crudos — exactamente lo que responde cada endpoint
// ============================================================

export interface ApiEmpresa {
  idempresa: number;
  ruc: string;
  nombreempresa: string;
  direccion: string;
}

/** POST /auth/login → resultado.usuario (auth.service.js) */
export interface ApiUsuarioSesion {
  id: number;
  nombre: string;
  correo: string;
  rol: string; // "Administrador" | "Usuario" (valor libre en BD)
}

/** GET /usuarios (lista, con JOIN a empresa) */
export interface ApiUsuarioListado {
  idusuario: number;
  nombreusuario: string;
  correo: string;
  rol: string;
  nombreempresa: string;
}

/** GET /vinedos (lista, con JOIN a empresa) */
export interface ApiVinedoListado {
  idvinedo: number;
  nombrevinedo: string;
  ubicacion: string;
  area_hectareas: string; // pg regresa numeric/decimal como string
  nombreempresa: string;
}

/** GET /vinedos/:id (SELECT * — sin el nombre de empresa, con su FK) */
export interface ApiVinedoDetalle {
  idvinedo: number;
  nombrevinedo: string;
  ubicacion: string;
  area_hectareas: string;
  empresa_idempresa: number;
}

/**
 * GET /sensores y GET /sensores/:id (mismo SELECT con JOIN a vinedo).
 * OJO: no incluye vinedo_idvinedo, solo el nombre — ver gap (1) arriba.
 */
export interface ApiSensor {
  idsensor: number;
  nombresensor: string;
  latitud: string;
  longitud: string;
  nombrevinedo: string;
}

/** Respuesta de POST/PUT /sensores (RETURNING *) — sí trae la FK */
export interface ApiSensorMutacion {
  idsensor: number;
  nombresensor: string;
  longitud: string;
  latitud: string;
  vinedo_idvinedo: number;
}

export interface ApiUmbral {
  idumbral: number;
  valorminimo: string;
  valormaximo: string;
  descripcion: string;
  sensor_idsensor: number;
}

/** GET /lecturas y GET /lecturas/:id (SELECT * FROM lecturasensor) */
export interface ApiLecturaSensor {
  idlectura: number;
  valor: string;
  fechalectura: string; // "YYYY-MM-DD"
  horalectura: string; // "HH:mm:ss"
  sensor_idsensor: number;
}

/**
 * GET /drones y GET /drones/:id (JOIN a vinedo).
 * OJO: no incluye vinedo_idvinedo, ni existe columna de estado/batería
 * en la tabla Dron — ver gap (2) arriba.
 */
export interface ApiDron {
  iddron: number;
  nombredron: string;
  nombrevinedo: string;
}

/** GET /imagenes y GET /imagenes/:id (SELECT * FROM imagen) */
export interface ApiImagen {
  idimagen: number;
  fechacaptura: string;
  horacaptura: string;
  tamanoarchivo: number;
  rutaarchivo: string; // ruta relativa, no URL absoluta
  ancho: number;
  alto: number;
  latitud: string;
  longitud: string;
  dron_iddron: number;
}

/**
 * GET /detecciones y GET /detecciones/:id (SELECT * FROM deteccionenfermedad).
 * No trae nombre de enfermedad ni datos de la imagen — ver gap (3) arriba.
 */
export interface ApiDeteccionEnfermedad {
  iddeteccion: number;
  nivelconfianza: string;
  descripcion: string;
  fechadeteccion: string;
  imagen_idimagen: number;
  tipoenfermedad_idenfermedad: number;
}

export interface ApiTipoEnfermedad {
  idenfermedad: number;
  nombreenfermedad: string;
}

/** GET /alertas (lista) — usa alias "estado" y "tipo" */
export interface ApiAlertaListado {
  idalerta: number;
  descripcion: string;
  estado: string; // viene de estadoalerta.nombreestado: "Pendiente" | "En Proceso" | "Resuelta"
  tipo: string; // viene de tipoalerta.nombretipo: "Sensor" | "Enfermedad"
}

/** GET /alertas/:id (detalle) — mismos datos con otros nombres de columna */
export interface ApiAlertaDetalle {
  idalerta: number;
  fecha: string;
  hora: string;
  descripcion: string;
  nombreestado: string;
  nombretipo: string;
}

/** GET /notificaciones (lista, con JOIN a usuario y alerta) */
export interface ApiNotificacion {
  idnotificacion: number;
  mensaje: string;
  fechaenvio: string;
  horaenvio: string;
  nombreusuario: string;
  alerta: string; // descripción de la alerta origen
}

// ============================================================
// B. Tipos de dominio — lo que consumen las vistas (camelCase)
// ============================================================

export interface Empresa {
  id: string;
  nombre: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
}

export interface Vinedo {
  id: string;
  nombre: string;
  ubicacion: string;
  areaHectareas: number;
  empresaId?: string;
  empresaNombre?: string;
}

/**
 * "estado" es CALCULADO en el cliente (no existe en la BD): compara
 * `ultimaLectura.valor` contra `umbral.valorMinimo` / `valorMaximo`.
 */
export type EstadoSensor = "normal" | "advertencia" | "critico" | "sin_datos";

export interface Sensor {
  id: string;
  nombre: string;
  vinedoId?: string; // ausente hasta que el backend lo incluya (gap 1)
  vinedoNombre: string;
  latitud: number;
  longitud: number;
  estado: EstadoSensor;
  umbral?: Umbral;
  ultimaLectura?: LecturaSensor;
}

export interface Umbral {
  id: string;
  sensorId: string;
  valorMinimo: number;
  valorMaximo: number;
  descripcion: string;
}

export interface LecturaSensor {
  id: string;
  sensorId: string;
  valor: number;
  fecha: string;
  hora: string;
}

/** El backend hoy no tiene estado ni batería para Dron (gap 2). */
export interface Dron {
  id: string;
  nombre: string;
  vinedoId?: string;
  vinedoNombre: string;
  imagenes: Imagen[];
}

export interface Imagen {
  id: string;
  dronId: string;
  url: string; // ya con la base URL del backend anteponiéndose a rutaArchivo
  fecha: string;
  hora: string;
  latitud: number;
  longitud: number;
  anchoPx: number;
  altoPx: number;
  tamanoArchivo: number; // unidad tal cual la guarda el backend (confirmar con backend si es KB o bytes)
}

export interface DeteccionEnfermedad {
  id: string;
  imagenId: string;
  enfermedad: string; // requiere resolver tipoenfermedad_idenfermedad (gap 3)
  nivelConfianza: number;
  fecha: string;
  descripcion: string;
  imagenUrl?: string; // requiere resolver imagen_idimagen (gap 3)
}

export type TipoAlerta = "Sensor" | "Enfermedad" | (string & {});
export type EstadoAlertaNombre = "Pendiente" | "En Proceso" | "Resuelta" | (string & {});

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  descripcion: string;
  fecha?: string; // solo disponible en el detalle (GET /alertas/:id)
  hora?: string;
  estado: EstadoAlertaNombre;
  origenNombre?: string; // hoy no viene resuelto desde el backend
  vinedoId?: string;
  empresaNombre?: string;
}

/** El backend no tiene columna "leida" (gap 4): se gestiona en cliente. */
export interface Notificacion {
  id: string;
  mensaje: string;
  fecha: string;
  hora: string;
  usuarioNombre: string;
  alertaDescripcion: string;
  leida: boolean;
}

// ============================================================
// C. Mappers — de la forma cruda de la API a los tipos de dominio
// ============================================================

/**
 * Clase CSS de tono a partir de un nombre de estado libre (viene de una
 * tabla editable: EstadoAlerta). Cubre los tres valores sembrados y cae a
 * "en_proceso" (ámbar) para cualquier valor nuevo no reconocido.
 */
export function claseEstadoAlerta(estado: string): "critico" | "en_proceso" | "resuelto" {
  const valor = estado.trim().toLowerCase();
  if (valor === "pendiente") return "critico";
  if (valor === "resuelta" || valor === "resuelto") return "resuelto";
  return "en_proceso";
}


//////////////////////////////////////////////////


/**
 * Modelos del panel de administrador.
 * Tipos de dominio para las vistas Admin (CRUD back-office) — ya no usan
 * mock en memoria: cada Admin view llama services/api.ts contra la API real.
 */

export interface EmpresaAdmin {
  id: string;
  nombre: string;
  ruc: string;
  direccion: string;
}

export interface VinedoAdmin {
  id: string;
  nombre: string;
  empresaId: string;
  empresaNombre: string;
  ubicacion: string;
  areaHectareas: number;
}

export interface UsuarioAdmin {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  empresaId: string;
  empresaNombre: string;
}

export interface SensorAdmin {
  id: string;
  nombre: string;
  vinedoId: string;
  vinedoNombre: string;
  latitud: number;
  longitud: number;
}

export interface DronAdmin {
  id: string;
  nombre: string;
  vinedoId: string;
  vinedoNombre: string;
}

export interface UmbralAdmin {
  id: string;
  sensorId: string;
  sensorNombre: string;
  valorMinimo: number;
  valorMaximo: number;
  descripcion: string;
}