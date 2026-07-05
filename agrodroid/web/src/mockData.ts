import type {
  DronAdmin,
  EmpresaAdmin,
  SensorAdmin,
  UmbralAdmin,
  UsuarioAdmin,
  VinedoAdmin,
} from "../src/types/models";

/**
 * Datos de ejemplo. Reemplaza estos arreglos (y el useState que los
 * inicializa en cada Vista) por tus llamadas reales a la API cuando la
 * conectes — la forma de los datos ya calza con las interfaces en types.ts.
 */

export const empresasMock: EmpresaAdmin[] = [
  {
    id: "1",
    nombre: "AgroVina SAC",
    ruc: "20123456789",
    direccion: "Ica, Perú",
    responsable: "Carlos Medina",
    estado: "Activo",
  },
  {
    id: "2",
    nombre: "Viñedos del Sur E.I.R.L.",
    ruc: "20456789123",
    direccion: "Pisco, Perú",
    responsable: "Lucía Fernández",
    estado: "Activo",
  },
];

export const vinedosMock: VinedoAdmin[] = [
  {
    id: "1",
    nombre: "Viñedo Santa Rosa",
    empresaId: "1",
    empresaNombre: "AgroVina SAC",
    latitud: -13.521,
    longitud: -71.9731,
    areaHectareas: 120.5,
    estado: "Activo",
  },
  {
    id: "2",
    nombre: "Viñedo San José",
    empresaId: "1",
    empresaNombre: "AgroVina SAC",
    latitud: -13.523,
    longitud: -71.9751,
    areaHectareas: 95.3,
    estado: "Activo",
  },
  {
    id: "3",
    nombre: "Viñedo La Esperanza",
    empresaId: "2",
    empresaNombre: "Viñedos del Sur E.I.R.L.",
    latitud: -13.525,
    longitud: -71.9771,
    areaHectareas: 80.75,
    estado: "Inactivo",
  },
];

export const usuariosMock: UsuarioAdmin[] = [
  {
    id: "1",
    nombre: "admin",
    correo: "admin@agrovina.com",
    rol: "Administrador",
    empresaId: "1",
    empresaNombre: "AgroVina SAC",
    estado: "Activo",
  },
  {
    id: "2",
    nombre: "supervisor1",
    correo: "supervisor1@agrovina.com",
    rol: "Usuario",
    empresaId: "1",
    empresaNombre: "AgroVina SAC",
    estado: "Activo",
  },
  {
    id: "3",
    nombre: "operador1",
    correo: "operador1@agrovina.com",
    rol: "Usuario",
    empresaId: "2",
    empresaNombre: "Viñedos del Sur E.I.R.L.",
    estado: "Inactivo",
  },
];

export const sensoresMock: SensorAdmin[] = [
  {
    id: "1",
    nombre: "HS_Norte_1",
    tipo: "Humedad",
    vinedoId: "1",
    vinedoNombre: "Viñedo Santa Rosa",
    estado: "Activo",
    latitud: -13.521,
    longitud: -71.9731,
  },
  {
    id: "2",
    nombre: "HS_Sur_1",
    tipo: "Temperatura",
    vinedoId: "1",
    vinedoNombre: "Viñedo Santa Rosa",
    estado: "Activo",
    latitud: -13.522,
    longitud: -71.9732,
  },
  {
    id: "3",
    nombre: "HS_Este_2",
    tipo: "Combinado",
    vinedoId: "2",
    vinedoNombre: "Viñedo San José",
    estado: "Inactivo",
    latitud: -13.5235,
    longitud: -71.974,
  },
];

export const dronesMock: DronAdmin[] = [
  {
    id: "1",
    codigo: "W_Norte_1",
    modelo: "DJI Agras T20",
    vinedoId: "1",
    vinedoNombre: "Viñedo Santa Rosa",
    estado: "Disponible",
    bateria: 92,
  },
  {
    id: "2",
    codigo: "W_Sur_1",
    modelo: "DJI Agras T20",
    vinedoId: "1",
    vinedoNombre: "Viñedo Santa Rosa",
    estado: "En vuelo",
    bateria: 61,
  },
  {
    id: "3",
    codigo: "W_Norte_2",
    modelo: "DJI Mavic 3M",
    vinedoId: "2",
    vinedoNombre: "Viñedo San José",
    estado: "Mantenimiento",
    bateria: 15,
  },
];

export const umbralesMock: UmbralAdmin[] = [
  {
    id: "1",
    sensorId: "1",
    sensorNombre: "HS_Norte_1",
    variable: "Humedad",
    valorMinimo: 40,
    valorMaximo: 70,
    estado: "Activo",
  },
  {
    id: "2",
    sensorId: "2",
    sensorNombre: "HS_Sur_1",
    variable: "Temperatura",
    valorMinimo: 18,
    valorMaximo: 30,
    estado: "Activo",
  },
];