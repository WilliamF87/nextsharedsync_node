import { validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const autenticarUsuario = async (req, res, next) => {

    // Revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        res.status(400).json({ errores: errores.array() });
    }

    // Revisar si el usuario está registrado
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });

    if(!usuario) {
        res.status(401).json({ msg: 'El Usuario no existe' });
        return next();
    }

    // Verificar el password y autenticar al usuario
    if(bcrypt.compareSync(password, usuario.password)) {

        // Comporbar si el usuario está confirmado
        if(!usuario.confirmado) {
            const error = new Error("Tu cuenta no ha sido confirmada");
            return res.status(403).json({msg: error.message});
        }

        const token = jwt.sign({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        }, process.env.CLAVE_SECRETA, {
            expiresIn: '8h'
        });

        res.json({ token });
    } else {
        res.status(401).json({ msg: 'Password incorrecto' });
        return next();
    }

}

const usuarioAutenticado = async (req, res) => {
    res.json({ usuario: req.usuario });
}

export {
    autenticarUsuario,
    usuarioAutenticado
}
















