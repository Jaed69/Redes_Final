const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const alertaRoutes = require("./routes/alerta.routes");
const notificacionRoutes = require("./routes/notificacion.routes");
const usuarioRoutes = require("./routes/usuario.routes");
const empresaRoutes = require("./routes/empresa.routes");
const vinedoRoutes = require("./routes/vinedo.routes");
const dronRoutes = require("./routes/dron.routes");
const imagenRoutes = require("./routes/imagen.routes");
const deteccionRoutes = require("./routes/deteccion.routes");
const lecturaRoutes = require("./routes/lectura.routes");
const sensorRoutes = require("./routes/sensor.routes");
const umbralRoutes = require("./routes/umbral.routes");
const systemRoutes = require("./routes/system.routes");
const authRoutes = require("./routes/auth.routes");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/alertas", alertaRoutes);
app.use("/notificaciones", notificacionRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/empresas", empresaRoutes);
app.use("/vinedos", vinedoRoutes);
app.use("/drones", dronRoutes);
app.use("/imagenes", imagenRoutes);
app.use("/detecciones", deteccionRoutes);
app.use("/lecturas", lecturaRoutes);
app.use("/sensores", sensorRoutes);
app.use("/umbrales", umbralRoutes);
app.use("/system", systemRoutes);
app.use("/auth", authRoutes);


app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

// Configuración del puerto
app.listen(3000, () => {
    console.log("Servidor corriendo en puerto 3000");
    console.log("Swagger UI disponible en http://localhost:3000/api-docs");
});
