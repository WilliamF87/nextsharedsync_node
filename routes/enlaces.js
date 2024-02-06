import express from "express"
import { check } from "express-validator";
import checkAuth from "../middleware/auth.js";
import {
    nuevoEnlace,
    obtenerEnlace,
    tienePassword,
    todosEnlaces,
    verificarPassword,
    editarEnlace,
    eliminarEnlace
} from "../controllers/enlacesController.js";
import { eliminarArchivo } from "../controllers/archivosController.js";

const router = express.Router();

router.post('/',
    [
        check('nombre', 'Sube un archivo').not().isEmpty(),
        check('nombre_original', 'Sube un archivo').not().isEmpty()
    ],
    checkAuth,
    nuevoEnlace
);

router.get('/',
    todosEnlaces
);

router.get('/:url',
    tienePassword,
    obtenerEnlace
);

router.post('/:url',
    verificarPassword,
    obtenerEnlace
);

router.post('/editar/descargas',
    checkAuth,
    editarEnlace
);

router.post('/eliminar/enlace',
    checkAuth,
    eliminarEnlace,
    eliminarArchivo
);

export default router;