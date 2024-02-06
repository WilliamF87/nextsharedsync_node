import express from "express";
import conectarDB from "./config/db.js";
import usuarios from "./routes/usuarios.js";
import auth from "./routes/auth.js";
import cors from "cors";
import enlaces from "./routes/enlaces.js";
import archivos from "./routes/archivos.js";
import carpetas from "./routes/carpetas.js";
import historials from "./routes/historials.js";

// Crear el servidor
const app = express();

// Permitir infomación tipo json
app.use(express.json());

// Conectar a la base de datos
conectarDB();

// Habilitar Cors
const opcionesCors = {
    origin: process.env.FRONTEND_URL
}

app.use( cors(opcionesCors) );

// Rutas
app.use('/api/usuarios', usuarios);
app.use('/api/auth', auth);
app.use('/api/enlaces', enlaces);
app.use('/api/archivos', archivos);
app.use('/api/carpetas', carpetas);
app.use('/api/historial', historials);

// Puerto de la app
const port = process.env.PORT || 4000;

// Arrancar la app
app.listen(port, '0.0.0.0', () => {
    console.log(`El servidor está funcionando en el puerto ${port}`);
});