import { validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import shortid from "shortid";
import Carpeta from "../models/Carpeta.js";
import { emailRegistro, emailOlvidePassword } from "../helpers/email.js";

const nuevoUsuario = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }
    
    // Verificar que el usuario no exista
    const { email } = req.body;
    let usuario = await Usuario.findOne({ email });

    if(usuario) {
        return res.status(400).json({ msg: 'El usuario ya está registrado' });
    }

    // Crear un nuevo usuario
    usuario = new Usuario(req.body);
    
    usuario.token = shortid.generate();

    try {
        await usuario.save();
        asignarCarpeta(email);

        // Enviar el Email de confirmación
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token,
        });

        return res.json({ msg: 'Usuario creado correctamente. Revisa tu Email para confirmar tu cuenta' });
    } catch (error) {
        console.log(error);
    }
}

const asignarCarpeta = async (email) => {
    let carpeta = new Carpeta();
    carpeta.nombre = shortid.generate();

    try {
        const usuario = await Usuario.findOne({ email });
        carpeta.usuario = usuario._id;
        await carpeta.save();
    } catch (error) {
        console.log(error);
    }
}

const confirmar = async (req, res) => {
    // params: contiene los datos de la url
    const { token } = req.params
    const usuarioConfirmar = await Usuario.findOne({ token });

    if(!usuarioConfirmar || usuarioConfirmar.confirmado === true) {
        return res.status(403).json({msg: null});
    }

    try {
        usuarioConfirmar.confirmado = true;
        usuarioConfirmar.token = "";
        await usuarioConfirmar.save();
        res.json({msg: "Usuario confirmado correctamente"});
    } catch (error) {
        console.log(error);
    }
};

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    // Comporbar si el usuario existe
    const usuario = await Usuario.findOne({ email })
    if(!usuario) {
        const error = new Error("El Usuario no existe");
        return res.status(404).json({msg: error.message});
    }

    try {
        usuario.token = shortid.generate();
        await usuario.save();

        // Enviar el Email
        emailOlvidePassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token,
        });

        return res.json({ msg: "Hemos enviado un email con las instrucciones" });
    } catch (error) {
        console.log(error);
    }
};

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Usuario.findOne({ token });

    if(tokenValido) {
        res.json({msg: "Token válido y el Usuario existe"});
    } else {
        const error = new Error("Token no válido");
        console.log(error);
        return res.status(404).json({msg: null});
    }
};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token });

    if(usuario) {
        usuario.password = password;
        usuario.token = "";
        
        try {
            await usuario.save();
            res.json({ msg: "Password modificado correctamente"});
        } catch (error) {
            console.log(error)
        }
    } else {
        const error = new Error("Token no válido");
        res.status(404).json({msg: error.message});
    }
};

export {
    nuevoUsuario,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
}