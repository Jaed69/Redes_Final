

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
  empresaNombre?: string;
}

/**
 * "estado" es CALCULADO en el cliente (no existe en la BD): compara
 * `ultimaLectura.valor` contra `umbral.valorMinimo` / `valorMaximo`.
 * Ver `calcularEstadoSensor` más abajo.
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

const numero = (v: string | number) => (typeof v === "number" ? v : parseFloat(v));

export function mapEmpresa(a: ApiEmpresa): Empresa {
  return { id: String(a.idempresa), nombre: a.nombreempresa };
}

export function mapVinedo(a: ApiVinedoListado | ApiVinedoDetalle): Vinedo {
  return {
    id: String(a.idvinedo),
    nombre: a.nombrevinedo,
    ubicacion: a.ubicacion,
    areaHectareas: numero(a.area_hectareas),
    empresaNombre: "nombreempresa" in a ? a.nombreempresa : undefined,
  };
}

export function mapUmbral(a: ApiUmbral): Umbral {
  return {
    id: String(a.idumbral),
    sensorId: String(a.sensor_idsensor),
    valorMinimo: numero(a.valorminimo),
    valorMaximo: numero(a.valormaximo),
    descripcion: a.descripcion,
  };
}

export function mapLectura(a: ApiLecturaSensor): LecturaSensor {
  return {
    id: String(a.idlectura),
    sensorId: String(a.sensor_idsensor),
    valor: numero(a.valor),
    fecha: a.fechalectura,
    hora: a.horalectura,
  };
}

/**
 * Calcula el estado de un sensor comparando su última lectura contra su
 * umbral. Ajusta el margen de "advertencia" (10% aquí) a tu criterio.
 */
export function calcularEstadoSensor(
  ultimaLectura: LecturaSensor | undefined,
  umbral: Umbral | undefined
): EstadoSensor {
  if (!ultimaLectura || !umbral) return "sin_datos";
  const { valor } = ultimaLectura;
  const { valorMinimo, valorMaximo } = umbral;
  if (valor < valorMinimo || valor > valorMaximo) return "critico";
  const margen = (valorMaximo - valorMinimo) * 0.1;
  if (valor < valorMinimo + margen || valor > valorMaximo - margen) return "advertencia";
  return "normal";
}

/**
 * vinedoIdPorNombre: mapa auxiliar { nombrevinedo -> idvinedo } armado con
 * la lista de Vinedo, necesario mientras /sensores y /drones no incluyan
 * el id (gap 1).
 */
export function mapSensor(
  a: ApiSensor,
  opts: {
    vinedoIdPorNombre?: Map<string, string>;
    ultimaLectura?: LecturaSensor;
    umbral?: Umbral;
  } = {}
): Sensor {
  return {
    id: String(a.idsensor),
    nombre: a.nombresensor,
    vinedoNombre: a.nombrevinedo,
    vinedoId: opts.vinedoIdPorNombre?.get(a.nombrevinedo),
    latitud: numero(a.latitud),
    longitud: numero(a.longitud),
    estado: calcularEstadoSensor(opts.ultimaLectura, opts.umbral),
    umbral: opts.umbral,
    ultimaLectura: opts.ultimaLectura,
  };
}

export function mapDron(
  a: ApiDron,
  opts: { vinedoIdPorNombre?: Map<string, string>; imagenes?: Imagen[] } = {}
): Dron {
  return {
    id: String(a.iddron),
    nombre: a.nombredron,
    vinedoNombre: a.nombrevinedo,
    vinedoId: opts.vinedoIdPorNombre?.get(a.nombrevinedo),
    imagenes: opts.imagenes ?? [],
  };
}

export function mapImagen(a: ApiImagen, baseUrl: string): Imagen {
  return {
    id: String(a.idimagen),
    dronId: String(a.dron_iddron),
    url: `${baseUrl}${a.rutaarchivo}`,
    fecha: a.fechacaptura,
    hora: a.horacaptura,
    latitud: numero(a.latitud),
    longitud: numero(a.longitud),
    anchoPx: a.ancho,
    altoPx: a.alto,
    tamanoArchivo: a.tamanoarchivo,
  };
}

/**
 * nombresEnfermedadPorId / imagenesPorId: mapas auxiliares necesarios
 * mientras /detecciones no incluya esos datos por JOIN (gap 3).
 */
export function mapDeteccion(
  a: ApiDeteccionEnfermedad,
  opts: { nombresEnfermedadPorId?: Map<string, string>; imagenesPorId?: Map<string, Imagen> } = {}
): DeteccionEnfermedad {
  return {
    id: String(a.iddeteccion),
    imagenId: String(a.imagen_idimagen),
    enfermedad: opts.nombresEnfermedadPorId?.get(String(a.tipoenfermedad_idenfermedad)) ?? "Desconocida",
    nivelConfianza: numero(a.nivelconfianza),
    fecha: a.fechadeteccion,
    descripcion: a.descripcion,
    imagenUrl: opts.imagenesPorId?.get(String(a.imagen_idimagen))?.url,
  };
}

export function mapAlerta(a: ApiAlertaListado | ApiAlertaDetalle): Alerta {
  if ("nombreestado" in a) {
    return {
      id: String(a.idalerta),
      tipo: a.nombretipo,
      estado: a.nombreestado,
      descripcion: a.descripcion,
      fecha: a.fecha,
      hora: a.hora,
    };
  }
  return {
    id: String(a.idalerta),
    tipo: a.tipo,
    estado: a.estado,
    descripcion: a.descripcion,
  };
}

export function mapNotificacion(a: ApiNotificacion, leidasIds: Set<string> = new Set()): Notificacion {
  const id = String(a.idnotificacion);
  return {
    id,
    mensaje: a.mensaje,
    fecha: a.fechaenvio,
    hora: a.horaenvio,
    usuarioNombre: a.nombreusuario,
    alertaDescripcion: a.alerta,
    leida: leidasIds.has(id),
  };
}

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
 * Son independientes de src/types/models.ts (que refleja la API real del
 * usuario/operador): aquí todo es mock en memoria, listo para conectar
 * a una API REST más adelante reemplazando el estado local de cada
 * vista por llamadas reales.
 */

export type EstadoGenerico = "Activo" | "Inactivo";

export interface EmpresaAdmin {
  id: string;
  nombre: string;
  ruc: string;
  direccion: string;
  responsable: string;
  estado: EstadoGenerico;
}

export interface VinedoAdmin {
  id: string;
  nombre: string;
  empresaId: string;
  empresaNombre: string;
  latitud: number;
  longitud: number;
  areaHectareas: number;
  estado: EstadoGenerico;
}

export interface UsuarioAdmin {
  id: string;
  nombre: string;
  correo: string;
  rol: "Administrador" | "Usuario";
  empresaId: string;
  empresaNombre: string;
  estado: EstadoGenerico;
}

export interface SensorAdmin {
  id: string;
  nombre: string;
  tipo: "Humedad" | "Temperatura" | "Combinado";
  vinedoId: string;
  vinedoNombre: string;
  estado: EstadoGenerico;
  latitud: number;
  longitud: number;
}

export interface DronAdmin {
  id: string;
  codigo: string;
  modelo: string;
  vinedoId: string;
  vinedoNombre: string;
  estado: "En vuelo" | "Disponible" | "Mantenimiento";
  bateria: number;
}

export interface UmbralAdmin {
  id: string;
  sensorId: string;
  sensorNombre: string;
  variable: "Humedad" | "Temperatura";
  valorMinimo: number;
  valorMaximo: number;
  estado: EstadoGenerico;
}