import express from "express";
import { check } from "express-validator";
import { autenticarUsuario, usuarioAutenticado } from "../controllers/authController.js";
import checkAuth from "../middleware/auth.js";

const router = express.Router();

router.post('/',
    [
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El password no puede ir vácio').not().isEmpty()
    ],
    autenticarUsuario
);

router.get('/',
    checkAuth,
    usuarioAutenticado
);

export default router;