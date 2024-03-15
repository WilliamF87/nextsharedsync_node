import express from "express";
import { check } from "express-validator";
import { nuevoUsuario, confirmar, olvidePassword, comprobarToken, nuevoPassword } from "../controllers/usuarioController.js";

const router = express.Router();

router.post('/',
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'Agrega un email válido').isEmail(),
        check('password', 'El Password debe ser de al menos 9 caracteres').isLength(9),
    ],
    nuevoUsuario
); // Crea un nuevo Usuario
router.get("/confirmar/:token", confirmar); // Los dos puntos en :token permiten generar routing dinamico en express
router.post("/olvide-password", olvidePassword); // Solicitar Token para recuperar password
router.route("/olvide-password/:token")
    .get(comprobarToken) // Validar Token para recuperar password
    .post(nuevoPassword);

export default router;