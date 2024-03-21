import express from "express";
import checkAuth from "../middleware/auth.js";
import { descargar, eliminarArchivo, registrarDescarga, subirArchivo } from "../controllers/archivosController.js";

const router = express.Router();

router.post('/',
    checkAuth,
    subirArchivo
);

router.get('/:carpeta/:archivo/:nombreOriginal',
    descargar
);

router.post('/registrarDescarga',
    checkAuth,
    registrarDescarga,
    eliminarArchivo
);

export default router;