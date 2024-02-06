import express from "express";
import { check } from "express-validator";
import { nuevoUsuario } from "../controllers/usuarioController.js";

const router = express.Router();

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El Password debe ser de al menos 6 caracteres').isLength(6),
    ],
    nuevoUsuario
);

export default router;