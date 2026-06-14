-- Created by Redgate Data Modeler (https://datamodeler.redgate-platform.com)
-- Last modification date: 2026-06-14 18:25:11.908

-- tables
-- Table: Alerta
CREATE TABLE Alerta (
    idAlerta int GENERATED ALWAYS AS IDENTITY,
    fecha date  NOT NULL,
    hora time  NOT NULL,
    descripcion varchar(255)  NOT NULL,
    Vinedo_idVinedo int  NOT NULL,
    DeteccionEnfermedad_idDeteccion int,
    LecturaSensor_idLectura int,
    EstadoAlerta_idEstado int  NOT NULL,
    TipoAlerta_idTipo int  NOT NULL,
    CONSTRAINT alerta_pk PRIMARY KEY (idAlerta)
);

-- Table: DeteccionEnfermedad
CREATE TABLE DeteccionEnfermedad (
    idDeteccion int GENERATED ALWAYS AS IDENTITY,
    nivelConfianza decimal(5,2)  NOT NULL,
    descripcion varchar(255)  NOT NULL,
    fechaDeteccion date  NOT NULL,
    Imagen_idImagen int  NOT NULL,
    TipoEnfermedad_idEnfermedad int  NOT NULL,
    CONSTRAINT deteccion_pk PRIMARY KEY (idDeteccion)
);

-- Table: Dron
CREATE TABLE Dron (
    idDron int GENERATED ALWAYS AS IDENTITY,
    nombreDron varchar(100)  NOT NULL UNIQUE,
    Vinedo_idVinedo int  NOT NULL,
    CONSTRAINT dron_pk PRIMARY KEY (idDron)
);

-- Table: Empresa
CREATE TABLE Empresa (
    idEmpresa int GENERATED ALWAYS AS IDENTITY,
    ruc varchar(11)  NOT NULL UNIQUE,
    nombreEmpresa varchar(255)  NOT NULL,
    direccion varchar(255)  NOT NULL,
    CONSTRAINT empresa_pk PRIMARY KEY (idEmpresa)
);

-- Table: EstadoAlerta
CREATE TABLE EstadoAlerta (
    idEstado int GENERATED ALWAYS AS IDENTITY,
    nombreEstado varchar(100)  NOT NULL,
    CONSTRAINT estadoalerta_pk PRIMARY KEY (idEstado)
);

-- Table: Imagen
CREATE TABLE Imagen (
    idImagen int GENERATED ALWAYS AS IDENTITY,
    fechaCaptura date  NOT NULL,
    horaCaptura time  NOT NULL,
    tamanoArchivo int  NOT NULL,
    rutaArchivo varchar(255)  NOT NULL,
    ancho int  NOT NULL,
    alto int  NOT NULL,
    latitud decimal(10,7)  NOT NULL,
    longitud decimal(10,7)  NOT NULL,
    Dron_idDron int  NOT NULL,
    CONSTRAINT imagen_pk PRIMARY KEY (idImagen)
);

-- Table: LecturaSensor
CREATE TABLE LecturaSensor (
    idLectura int GENERATED ALWAYS AS IDENTITY,
    valor decimal(10,2)  NOT NULL,
    fechaLectura date  NOT NULL,
    horaLectura time  NOT NULL,
    Sensor_idSensor int  NOT NULL,
    CONSTRAINT lecturasensor_pk PRIMARY KEY (idLectura)
);

-- Table: Notificacion
CREATE TABLE Notificacion (
    idNotificacion int GENERATED ALWAYS AS IDENTITY,
    mensaje varchar(300)  NOT NULL,
    fechaEnvio date  NOT NULL,
    horaEnvio time  NOT NULL,
    Usuario_idUsuario int  NOT NULL,
    Alerta_idAlerta int  NOT NULL,
    CONSTRAINT notificacion_pk PRIMARY KEY (idNotificacion)
);

-- Table: Sensor
CREATE TABLE Sensor (
    idSensor int GENERATED ALWAYS AS IDENTITY,
    nombreSensor varchar(255)  NOT NULL UNIQUE,
    longitud decimal(10,7)  NOT NULL,
    latitud decimal(10,7)  NOT NULL,
    Vinedo_idVinedo int  NOT NULL,
    CONSTRAINT sensor_pk PRIMARY KEY (idSensor)
);

-- Table: TipoAlerta
CREATE TABLE TipoAlerta (
    idTipo int GENERATED ALWAYS AS IDENTITY,
    nombreTipo varchar(100)  NOT NULL,
    CONSTRAINT tipoalerta_pk PRIMARY KEY (idTipo)
);

-- Table: TipoEnfermedad
CREATE TABLE TipoEnfermedad (
    idEnfermedad int GENERATED ALWAYS AS IDENTITY,
    nombreEnfermedad varchar(255)  NOT NULL,
    CONSTRAINT tipoenfermedad_pk PRIMARY KEY (idEnfermedad)
);

-- Table: Umbral
CREATE TABLE Umbral (
    idUmbral int GENERATED ALWAYS AS IDENTITY,
    valorMinimo decimal(10,2)  NOT NULL,
    valorMaximo decimal(10,2)  NOT NULL,
    descripcion varchar(255)  NOT NULL,
    Sensor_idSensor int  NOT NULL,
    CONSTRAINT umbral_pk PRIMARY KEY (idUmbral)
);

-- Table: Usuario
CREATE TABLE Usuario (
    idUsuario int GENERATED ALWAYS AS IDENTITY,
    nombreUsuario varchar(255)  NOT NULL UNIQUE,
    correo varchar(255)  NOT NULL UNIQUE,
    contrasenia varchar(255)  NOT NULL,
    rol varchar(100)  NOT NULL,
    Empresa_idEmpresa int  NOT NULL,
    CONSTRAINT usuario_pk PRIMARY KEY (idUsuario)
);

-- Table: Vinedo
CREATE TABLE Vinedo (
    idVinedo int GENERATED ALWAYS AS IDENTITY,
    nombreVinedo varchar(255)  NOT NULL,
    ubicacion varchar(255)  NOT NULL,
    area_hectareas decimal(10,2)  NOT NULL,
    Empresa_idEmpresa int  NOT NULL,
    CONSTRAINT vinedo_pk PRIMARY KEY (idVinedo)
);

-- foreign keys
-- Reference: Alerta_DeteccionEnfermedad (table: Alerta)
ALTER TABLE Alerta ADD CONSTRAINT Alerta_DeteccionEnfermedad
    FOREIGN KEY (DeteccionEnfermedad_idDeteccion)
    REFERENCES DeteccionEnfermedad (idDeteccion)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Alerta_EstadoAlerta (table: Alerta)
ALTER TABLE Alerta ADD CONSTRAINT Alerta_EstadoAlerta
    FOREIGN KEY (EstadoAlerta_idEstado)
    REFERENCES EstadoAlerta (idEstado)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Alerta_LecturaSensor (table: Alerta)
ALTER TABLE Alerta ADD CONSTRAINT Alerta_LecturaSensor
    FOREIGN KEY (LecturaSensor_idLectura)
    REFERENCES LecturaSensor (idLectura)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Alerta_TipoAlerta (table: Alerta)
ALTER TABLE Alerta ADD CONSTRAINT Alerta_TipoAlerta
    FOREIGN KEY (TipoAlerta_idTipo)
    REFERENCES TipoAlerta (idTipo)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Alerta_Vinedo (table: Alerta)
ALTER TABLE Alerta ADD CONSTRAINT Alerta_Vinedo
    FOREIGN KEY (Vinedo_idVinedo)
    REFERENCES Vinedo (idVinedo)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: DeteccionEnfermedad_Imagen (table: DeteccionEnfermedad)
ALTER TABLE DeteccionEnfermedad ADD CONSTRAINT DeteccionEnfermedad_Imagen
    FOREIGN KEY (Imagen_idImagen)
    REFERENCES Imagen (idImagen)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: DeteccionEnfermedad_TipoEnfermedad (table: DeteccionEnfermedad)
ALTER TABLE DeteccionEnfermedad ADD CONSTRAINT DeteccionEnfermedad_TipoEnfermedad
    FOREIGN KEY (TipoEnfermedad_idEnfermedad)
    REFERENCES TipoEnfermedad (idEnfermedad)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Dron_Vinedo (table: Dron)
ALTER TABLE Dron ADD CONSTRAINT Dron_Vinedo
    FOREIGN KEY (Vinedo_idVinedo)
    REFERENCES Vinedo (idVinedo)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Imagen_Dron (table: Imagen)
ALTER TABLE Imagen ADD CONSTRAINT Imagen_Dron
    FOREIGN KEY (Dron_idDron)
    REFERENCES Dron (idDron)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: LecturaSensor_Sensor (table: LecturaSensor)
ALTER TABLE LecturaSensor ADD CONSTRAINT LecturaSensor_Sensor
    FOREIGN KEY (Sensor_idSensor)
    REFERENCES Sensor (idSensor)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Notificacion_Alerta (table: Notificacion)
ALTER TABLE Notificacion ADD CONSTRAINT Notificacion_Alerta
    FOREIGN KEY (Alerta_idAlerta)
    REFERENCES Alerta (idAlerta)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Notificacion_Usuario (table: Notificacion)
ALTER TABLE Notificacion ADD CONSTRAINT Notificacion_Usuario
    FOREIGN KEY (Usuario_idUsuario)
    REFERENCES Usuario (idUsuario)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Sensor_Vinedo (table: Sensor)
ALTER TABLE Sensor ADD CONSTRAINT Sensor_Vinedo
    FOREIGN KEY (Vinedo_idVinedo)
    REFERENCES Vinedo (idVinedo)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Umbral_Sensor (table: Umbral)
ALTER TABLE Umbral ADD CONSTRAINT Umbral_Sensor
    FOREIGN KEY (Sensor_idSensor)
    REFERENCES Sensor (idSensor)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Usuario_Empresa (table: Usuario)
ALTER TABLE Usuario ADD CONSTRAINT Usuario_Empresa
    FOREIGN KEY (Empresa_idEmpresa)
    REFERENCES Empresa (idEmpresa)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: Vinedo_Empresa (table: Vinedo)
ALTER TABLE Vinedo ADD CONSTRAINT Vinedo_Empresa
    FOREIGN KEY (Empresa_idEmpresa)
    REFERENCES Empresa (idEmpresa)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- End of file.


-- Data generation

-- EMPRESA
INSERT INTO Empresa (ruc, nombreEmpresa, direccion)
VALUES
('20123456789', 'AgroVina SAC', 'Ica, Peru');

-- VINEDOS
INSERT INTO Vinedo
(nombreVinedo, ubicacion, area_hectareas, Empresa_idEmpresa)
VALUES
('Vinedo Santa Rosa', 'Ica', 120.50, 1),
('Vinedo San Jose', 'Pisco', 95.30, 1),
('Vinedo La Esperanza', 'Nazca', 80.75, 1);

-- USUARIOS
INSERT INTO Usuario (nombreUsuario, correo, contrasenia, rol, Empresa_idEmpresa)
VALUES
('admin', 'admin@agrovina.com', 'admin123', 'Administrador', 1),
('supervisor1', 'supervisor1@agrovina.com', 'clave123', 'Supervisor', 1),
('operador1', 'operador1@agrovina.com', 'clave123', 'Operador', 1);

-- DRONES
INSERT INTO Dron (nombreDron, Vinedo_idVinedo) VALUES
('W_Norte_1', 1),
('W_Sur_1', 1),
('W_Este_1', 1),
('W_Oeste_1', 1),

('W_Norte_2', 2),
('W_Sur_2', 2),
('W_Este_2', 2),
('W_Oeste_2', 2),

('W_Norte_3', 3),
('W_Sur_3', 3),
('W_Este_3', 3),
('W_Oeste_3', 3);

-- SENSORES
INSERT INTO Sensor (nombreSensor, longitud, latitud, Vinedo_idVinedo) VALUES
-- Viñedo 1
('HS_Norte_1', -71.9731000, -13.5210000, 1),
('HS_Sur_1',   -71.9732000, -13.5220000, 1),
('HS_Este_1',  -71.9720000, -13.5215000, 1),
('HS_Oeste_1', -71.9740000, -13.5215000, 1),

-- Viñedo 2
('HS_Norte_2', -71.9751000, -13.5230000, 2),
('HS_Sur_2',   -71.9752000, -13.5240000, 2),
('HS_Este_2',  -71.9740000, -13.5235000, 2),
('HS_Oeste_2', -71.9760000, -13.5235000, 2),

-- Viñedo 3
('HS_Norte_3', -71.9771000, -13.5250000, 3),
('HS_Sur_3',   -71.9772000, -13.5260000, 3),
('HS_Este_3',  -71.9760000, -13.5255000, 3),
('HS_Oeste_3', -71.9780000, -13.5255000, 3);

-- UMBRALES
INSERT INTO Umbral (valorMinimo, valorMaximo, descripcion, Sensor_idSensor)
VALUES
(18, 30, 'Temperatura ideal', 1),
(40, 70, 'Humedad ideal', 2),
(18, 30, 'Temperatura ideal', 3),
(40, 70, 'Humedad ideal', 4),

(18, 30, 'Temperatura ideal', 5),
(40, 70, 'Humedad ideal', 6),
(18, 30, 'Temperatura ideal', 7),
(40, 70, 'Humedad ideal', 8),

(18, 30, 'Temperatura ideal', 9),
(40, 70, 'Humedad ideal', 10),
(18, 30, 'Temperatura ideal', 11),
(40, 70, 'Humedad ideal', 12);

-- TIPOS DE ENFERMEDAD
INSERT INTO TipoEnfermedad (nombreEnfermedad) VALUES
('Oidio'),
('Mildiu'),
('Botrytis'),
('Antracnosis'),
('Yesca'),
('Podredumbre Acida');

-- TIPOS DE ALERTA
INSERT INTO TipoAlerta (nombreTipo)
VALUES
('Sensor'),
('Enfermedad');

-- ESTADOS DE ALERTA
INSERT INTO EstadoAlerta (nombreEstado)
VALUES
('Pendiente'),
('En Proceso'),
('Resuelta');

-- IMAGENES
INSERT INTO Imagen
(fechaCaptura, horaCaptura, tamanoArchivo, rutaArchivo,
 ancho, alto, latitud, longitud, Dron_idDron)
VALUES
('2026-06-10', '09:15:00', 3500, '/imagenes/img001.jpg',
 1920, 1080, -14.0677000, -75.7295000, 1),

('2026-06-10', '10:20:00', 4100, '/imagenes/img002.jpg',
 1920, 1080, -13.7102000, -76.2201000, 2),

('2026-06-10', '11:30:00', 3900, '/imagenes/img003.jpg',
 1920, 1080, -14.8304000, -74.9405000, 3);

-- DETECCIONES DE ENFERMEDAD
INSERT INTO DeteccionEnfermedad
(nivelConfianza, descripcion, fechaDeteccion,
 Imagen_idImagen, TipoEnfermedad_idEnfermedad)
VALUES
(94.50, 'Presencia de Mildiu en hojas', '2026-06-10', 1, 2),
(88.20, 'Posible Oidio detectado', '2026-06-10', 2, 1);

-- LECTURAS DE SENSORES
INSERT INTO LecturaSensor
(valor, fechaLectura, horaLectura, Sensor_idSensor)
VALUES
(31.20, '2026-06-10', '08:30:00', 7),
(72.40, '2026-06-10', '08:30:00', 8),
(28.60, '2026-06-10', '08:40:00', 9),
(68.90, '2026-06-10', '08:40:00', 10),
(30.10, '2026-06-10', '08:50:00', 11),
(74.30, '2026-06-10', '08:50:00', 12);

-- ALERTAS
INSERT INTO Alerta
(fecha, hora, descripcion, Vinedo_idVinedo,
 DeteccionEnfermedad_idDeteccion,
 LecturaSensor_idLectura,
 EstadoAlerta_idEstado,
 TipoAlerta_idTipo)
VALUES
('2026-06-10', '09:30:00',
 'Detección de Mildiu con alta confianza en hojas de vid',
 1, 1, NULL, 1, 2),

('2026-06-10', '08:05:00',
 'Humedad del suelo fuera del rango establecido por el umbral',
 1, NULL, 2, 2, 1),

('2026-06-10', '10:30:00',
 'Detección de Oidio en cultivo de vid mediante análisis de imágenes',
 2, 2, NULL, 1, 2);

-- NOTIFICACIONES
INSERT INTO Notificacion
(mensaje, fechaEnvio, horaEnvio,
 Usuario_idUsuario, Alerta_idAlerta)
VALUES
('Alerta: Mildiu detectado en Vinedo Norte', '2026-06-10', '09:31:00', 2, 1),
('Alerta: Humedad del suelo fuera del rango establecido en Vinedo Norte', '2026-06-10', '08:06:00', 2, 2),
('Alerta: Oidio detectado en Vinedo Sur', '2026-06-10', '10:31:00', 1, 3);
