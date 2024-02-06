import express from "express";
import checkAuth from "../middleware/auth.js";
import { historialArchivo, historialUsuario } from "../controllers/historialsController.js";

const router = express.Router();

router.get('/',
    checkAuth,
    historialUsuario
);

router.get('/:idArchivo',
    checkAuth,
    historialArchivo
);

export default router;