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
('20123456789', 'AgroVina SAC', 'Ica, Peru'),
('20987654321', 'Vinas del Sur SAC', 'Arequipa, Peru');

-- VINEDOS
INSERT INTO Vinedo
(nombreVinedo, ubicacion, area_hectareas, Empresa_idEmpresa)
VALUES
('Vinedo Santa Rosa', 'Ica', 120.50, 1),
('Vinedo San Jose', 'Pisco', 95.30, 1),
('Vinedo La Esperanza', 'Nazca', 80.75, 1),
('Vinedo El Pedregal', 'Arequipa', 150.20, 2),
('Vinedo Majes', 'Caylloma', 110.40, 2),
('Vinedo Vitor', 'Arequipa', 75.80, 2);

-- USUARIOS (creds: admin@*/admin123, resto/clave123)
INSERT INTO Usuario (nombreUsuario, correo, contrasenia, rol, Empresa_idEmpresa)
VALUES
('admin', 'admin@agrovina.com', '$2b$10$jhHbwEekykq1dkI13xXBr.p7uaXihsf05WOALGAl2BJf.TKYNaJNu', 'admin', 1),
('supervisor1', 'supervisor1@agrovina.com', '$2b$10$ySqy1qY3ywmGBxkH.mO8RuOzEsLosl3e358jC0QfTDqKUb2XtnptW', 'cliente', 1),
('operador1', 'operador1@agrovina.com', '$2b$10$ySqy1qY3ywmGBxkH.mO8RuOzEsLosl3e358jC0QfTDqKUb2XtnptW', 'monitor', 1),
('ti1', 'ti1@agrovina.com', '$2b$10$K1Ek5km.ZiBfAuDlmKmzUObp1iFi1ms0m/.UFdbxBe/X1P46QgvGy', 'ti', 1),
('operador2', 'operador2@agrovina.com', '$2b$10$ySqy1qY3ywmGBxkH.mO8RuOzEsLosl3e358jC0QfTDqKUb2XtnptW', 'monitor', 1),
('supervisor2', 'supervisor2@agrovina.com', '$2b$10$ySqy1qY3ywmGBxkH.mO8RuOzEsLosl3e358jC0QfTDqKUb2XtnptW', 'cliente', 1),
('ti2', 'ti2@agrovina.com', '$2b$10$K1Ek5km.ZiBfAuDlmKmzUObp1iFi1ms0m/.UFdbxBe/X1P46QgvGy', 'ti', 1),
('admin2', 'admin@vinasdelsur.com', '$2b$10$jhHbwEekykq1dkI13xXBr.p7uaXihsf05WOALGAl2BJf.TKYNaJNu', 'admin', 2),
('operador3', 'monitor@vinasdelsur.com', '$2b$10$ySqy1qY3ywmGBxkH.mO8RuOzEsLosl3e358jC0QfTDqKUb2XtnptW', 'monitor', 2),
('supervisor3', 'cliente@vinasdelsur.com', '$2b$10$ySqy1qY3ywmGBxkH.mO8RuOzEsLosl3e358jC0QfTDqKUb2XtnptW', 'cliente', 2),
('ti3', 'ti@vinasdelsur.com', '$2b$10$K1Ek5km.ZiBfAuDlmKmzUObp1iFi1ms0m/.UFdbxBe/X1P46QgvGy', 'ti', 2);

-- DRONES
INSERT INTO Dron (nombreDron, Vinedo_idVinedo) VALUES
('W_Norte_1', 1), ('W_Sur_1', 1), ('W_Este_1', 1), ('W_Oeste_1', 1),
('W_Norte_2', 2), ('W_Sur_2', 2), ('W_Este_2', 2), ('W_Oeste_2', 2),
('W_Norte_3', 3), ('W_Sur_3', 3), ('W_Este_3', 3), ('W_Oeste_3', 3),
('W_Norte_4', 4), ('W_Sur_4', 4), ('W_Este_4', 4), ('W_Oeste_4', 4),
('W_Norte_5', 5), ('W_Sur_5', 5), ('W_Este_5', 5), ('W_Oeste_5', 5),
('W_Norte_6', 6), ('W_Sur_6', 6), ('W_Este_6', 6), ('W_Oeste_6', 6);

-- SENSORES
INSERT INTO Sensor (nombreSensor, longitud, latitud, Vinedo_idVinedo) VALUES
('HS_Norte_1', -71.9731, -13.5210, 1), ('HS_Sur_1', -71.9732, -13.5220, 1),
('HS_Este_1',  -71.9720, -13.5215, 1), ('HS_Oeste_1', -71.9740, -13.5215, 1),
('HS_Norte_2', -71.9751, -13.5230, 2), ('HS_Sur_2', -71.9752, -13.5240, 2),
('HS_Este_2',  -71.9740, -13.5235, 2), ('HS_Oeste_2', -71.9760, -13.5235, 2),
('HS_Norte_3', -71.9771, -13.5250, 3), ('HS_Sur_3', -71.9772, -13.5260, 3),
('HS_Este_3',  -71.9760, -13.5255, 3), ('HS_Oeste_3', -71.9780, -13.5255, 3),
('HS_Norte_4', -71.9735, -16.3980, 4), ('HS_Sur_4', -71.9736, -16.3990, 4),
('HS_Este_4',  -71.9725, -16.3985, 4), ('HS_Oeste_4', -71.9745, -16.3985, 4),
('HS_Norte_5', -71.9755, -16.4000, 5), ('HS_Sur_5', -71.9756, -16.4010, 5),
('HS_Este_5',  -71.9745, -16.4005, 5), ('HS_Oeste_5', -71.9765, -16.4005, 5),
('HS_Norte_6', -71.9775, -16.4020, 6), ('HS_Sur_6', -71.9776, -16.4030, 6),
('HS_Este_6',  -71.9765, -16.4025, 6), ('HS_Oeste_6', -71.9785, -16.4025, 6);

-- UMBRALES
INSERT INTO Umbral (valorMinimo, valorMaximo, descripcion, Sensor_idSensor)
VALUES
-- empresa 1
(18, 30, 'Temperatura ideal', 1), (40, 70, 'Humedad ideal', 2),
(18, 30, 'Temperatura ideal', 3), (40, 70, 'Humedad ideal', 4),
(18, 30, 'Temperatura ideal', 5), (40, 70, 'Humedad ideal', 6),
(18, 30, 'Temperatura ideal', 7), (40, 70, 'Humedad ideal', 8),
(18, 30, 'Temperatura ideal', 9), (40, 70, 'Humedad ideal', 10),
(18, 30, 'Temperatura ideal', 11), (40, 70, 'Humedad ideal', 12),
-- empresa 2
(18, 30, 'Temperatura ideal', 13), (40, 70, 'Humedad ideal', 14),
(18, 30, 'Temperatura ideal', 15), (40, 70, 'Humedad ideal', 16),
(18, 30, 'Temperatura ideal', 17), (40, 70, 'Humedad ideal', 18),
(18, 30, 'Temperatura ideal', 19), (40, 70, 'Humedad ideal', 20),
(18, 30, 'Temperatura ideal', 21), (40, 70, 'Humedad ideal', 22),
(18, 30, 'Temperatura ideal', 23), (40, 70, 'Humedad ideal', 24);

-- TIPOS DE ENFERMEDAD
INSERT INTO TipoEnfermedad (nombreEnfermedad) VALUES
('Oidio'), ('Mildiu'), ('Botrytis'), ('Antracnosis'), ('Yesca'), ('Podredumbre Acida');

-- TIPOS DE ALERTA
INSERT INTO TipoAlerta (nombreTipo) VALUES ('Sensor'), ('Enfermedad');

-- ESTADOS DE ALERTA
INSERT INTO EstadoAlerta (nombreEstado) VALUES ('Pendiente'), ('En Proceso'), ('Resuelta');

-- IMAGENES (varias por dron para galerias con contenido)
INSERT INTO Imagen
(fechaCaptura, horaCaptura, tamanoArchivo, rutaArchivo,
 ancho, alto, latitud, longitud, Dron_idDron)
VALUES
-- empresa 1
('2026-06-15', '09:15:00', 3500, '/imagenes/img001.jpg', 1920, 1080, -13.5210, -71.9731, 1),
('2026-06-18', '10:20:00', 4200, '/imagenes/img002.jpg', 1920, 1080, -13.5220, -71.9732, 1),
('2026-06-21', '11:30:00', 3800, '/imagenes/img003.jpg', 1920, 1080, -13.5215, -71.9740, 1),
('2026-06-16', '09:00:00', 3600, '/imagenes/img004.jpg', 1920, 1080, -13.5230, -71.9751, 2),
('2026-06-19', '10:15:00', 4100, '/imagenes/img005.jpg', 1920, 1080, -13.5240, -71.9752, 2),
('2026-06-17', '08:45:00', 3700, '/imagenes/img006.jpg', 1920, 1080, -13.5250, -71.9771, 3),
('2026-06-20', '10:00:00', 3900, '/imagenes/img007.jpg', 1920, 1080, -13.5260, -71.9772, 3),
-- empresa 2 (drones ids 13-24)
('2026-06-14', '09:30:00', 3500, '/imagenes/img008.jpg', 1920, 1080, -16.3980, -71.9735, 13),
('2026-06-17', '10:45:00', 4200, '/imagenes/img009.jpg', 1920, 1080, -16.3990, -71.9736, 13),
('2026-06-15', '09:15:00', 3600, '/imagenes/img010.jpg', 1920, 1080, -16.4000, -71.9755, 17),
('2026-06-18', '10:30:00', 4100, '/imagenes/img011.jpg', 1920, 1080, -16.4010, -71.9756, 17),
('2026-06-16', '08:50:00', 3800, '/imagenes/img012.jpg', 1920, 1080, -16.4020, -71.9775, 21),
('2026-06-19', '11:00:00', 3700, '/imagenes/img013.jpg', 1920, 1080, -16.4025, -71.9765, 21);

-- DETECCIONES DE ENFERMEDAD
INSERT INTO DeteccionEnfermedad
(nivelConfianza, descripcion, fechaDeteccion,
 Imagen_idImagen, TipoEnfermedad_idEnfermedad)
VALUES
(94.50, 'Presencia de Mildiu en hojas', '2026-06-15', 1, 2),
(88.20, 'Posible Oidio detectado', '2026-06-18', 2, 1),
(76.80, 'Manchas de Botrytis en racimos', '2026-06-16', 4, 3),
(91.30, 'Antracnosis en hojas jovenes', '2026-06-17', 6, 4),
(82.10, 'Yesca marcada en tronco', '2026-06-14', 8, 5),
(89.40, 'Mildiu avanzado en sector Sur', '2026-06-19', 2, 2),
(73.50, 'Podredumbre acida inicial', '2026-06-15', 10, 6),
(85.60, 'Oidio esporulado', '2026-06-21', 3, 1),
(79.20, 'Botrytis en racimos maduros', '2026-06-18', 11, 3),
(95.10, 'Mildiu esporulado en envés', '2026-06-19', 9, 2);

-- LECTURAS DE SENSORES (series temporales 14 dias, 2 lecturas/dia)
INSERT INTO LecturaSensor (valor, fechaLectura, horaLectura, Sensor_idSensor)
SELECT
  CASE
    WHEN (s.idsensor % 4) IN (0,1) THEN
      (20 + (random() * 12))::numeric(10,2)
    ELSE
      (38 + (random() * 35))::numeric(10,2)
  END,
  (DATE '2026-06-20' + dia)::date,
  hora,
  s.idsensor
FROM Sensor s
CROSS JOIN generate_series(0, 13) AS dia
CROSS JOIN (VALUES (TIME '08:00:00'), (TIME '14:00:00')) AS t(hora);

-- ALERTAS (15 distribuidas, estados y tipos varios)
INSERT INTO Alerta
(fecha, hora, descripcion, Vinedo_idVinedo,
 DeteccionEnfermedad_idDeteccion, LecturaSensor_idLectura,
 EstadoAlerta_idEstado, TipoAlerta_idTipo)
VALUES
-- vinedo 1 (Pendiente + Resuelta)
('2026-06-15', '09:30:00', 'Mildiu con alta confianza en hojas de vid', 1, 1, NULL, 1, 2),
('2026-06-18', '08:10:00', 'Humedad fuera del rango establecido', 1, NULL, NULL, 3, 1),
('2026-06-21', '11:00:00', 'Oidio esporulado detectado', 1, 8, NULL, 3, 2),
-- vinedo 2 (En Proceso + Pendiente)
('2026-06-16', '09:05:00', 'Manchas de Botrytis en racimos', 2, 3, NULL, 2, 2),
('2026-06-20', '08:45:00', 'Temperatura sobre umbral Critico', 2, NULL, NULL, 1, 1),
-- vinedo 3 (Resuelta + Pendiente)
('2026-06-17', '08:50:00', 'Antracnosis en hojas jovenes', 3, 4, NULL, 3, 2),
('2026-06-19', '07:30:00', 'Humedad bajo limite inferior', 3, NULL, NULL, 1, 1),
-- vinedo 4 (Pendiente + En Proceso)
('2026-06-14', '09:35:00', 'Yesca marcada en tronco', 4, 5, NULL, 1, 2),
('2026-06-18', '10:00:00', 'Temperatura elevada sostenidad', 4, NULL, NULL, 2, 1),
-- vinedo 5 (Resuelta + Pendiente + En Proceso)
('2026-06-15', '09:20:00', 'Podredumbre acida inicial', 5, 7, NULL, 3, 2),
('2026-06-19', '11:10:00', 'Humedad excesiva post riego', 5, NULL, NULL, 1, 1),
('2026-06-22', '08:30:00', 'Mildiu en sector Norte', 5, 10, NULL, 2, 2),
-- vinedo 6 (En Proceso + Resuelta)
('2026-06-16', '08:55:00', 'Oidio esporulado', 6, 6, NULL, 2, 2),
('2026-06-19', '11:05:00', 'Botrytis en racimos maduros', 6, 9, NULL, 3, 2),
('2026-06-21', '09:15:00', 'Sensor humedad con ruido alto', 6, NULL, NULL, 1, 1);

-- NOTIFICACIONES (para usuarios de ambas empresas)
INSERT INTO Notificacion
(mensaje, fechaEnvio, horaEnvio, Usuario_idUsuario, Alerta_idAlerta)
VALUES
-- empresa 1
('Mildiu detectado en Vinedo Santa Rosa', '2026-06-15', '09:31:00', 1, 1),
('Humedad fuera de rango en Vinedo Santa Rosa', '2026-06-18', '08:06:00', 1, 2),
('Oidio resuelto en Vinedo Santa Rosa', '2026-06-21', '11:05:00', 1, 3),
('Botrytis en Vinedo San Jose', '2026-06-16', '09:10:00', 2, 4),
('Temperatura critica en Vinedo San Jose', '2026-06-20', '08:50:00', 2, 5),
('Antracnosis ya resuelta en Vinedo La Esperanza', '2026-06-17', '09:00:00', 2, 6),
('Humedad baja en Vinedo La Esperanza', '2026-06-19', '07:35:00', 2, 7),
('Nueva alerta de Mildiu para operador', '2026-06-15', '09:32:00', 3, 1),
('Confirmacion de Oidio resuelto', '2026-06-21', '11:10:00', 3, 3),
('Reporte de Botrytis para revision', '2026-06-16', '09:12:00', 3, 4),
-- empresa 2
('Yesca marcada en Vinedo El Pedregal', '2026-06-14', '09:40:00', 9, 8),
('Temperatura sostenida en Vinedo El Pedregal', '2026-06-18', '10:05:00', 9, 9),
('Podredumbre resuelta en Vinedo Majes', '2026-06-15', '09:25:00', 9, 10),
('Humedad excesiva en Vinedo Majes', '2026-06-19', '11:15:00', 9, 11),
('Nuevo Mildiu en Vinedo Majes', '2026-06-22', '08:35:00', 9, 12),
('Oidio en revision en Vinedo Vitor', '2026-06-16', '09:00:00', 9, 13),
('Botrytis resuelto en Vinedo Vitor', '2026-06-19', '11:10:00', 9, 14),
('Ruido alta en sensor Vinedo Vitor', '2026-06-21', '09:20:00', 9, 15);
