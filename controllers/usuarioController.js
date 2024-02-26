import { validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import shortid from "shortid";
import Carpeta from "../models/Carpeta.js";

const nuevoUsuario = async (req, res) => {

    // Revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    
    // Verificar que el usuario no exista
    const { email, password } = req.body;
    let usuario = await Usuario.findOne({ email });

    if(usuario) {
        return res.status(400).json({ msg: 'El usuario ya está registrado' });
    }

    // Crear un nuevo usuario
    usuario = new Usuario(req.body);

    // Hashear el password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);

    try {
        await usuario.save();
        asignarCarpeta(email);
        return res.json({ msg: 'Usuario creado correctamente' });
    } catch (error) {
        console.log(error);
    }
}

const asignarCarpeta = async (email) => {
    let carpeta = new Carpeta();
    carpeta.nombre = shortid.generate();
    // carpeta.nombre = "YyjQ4g2es"; Crear carpeta de usuarios anónimos 

    try {
        const usuario = await Usuario.findOne({ email });
        carpeta.usuario = usuario._id;
        await carpeta.save();
    } catch (error) {
        console.log(error);
    }
}

export {
    nuevoUsuario
}