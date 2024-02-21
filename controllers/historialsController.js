import mongoose from "mongoose";
import Carpeta from "../models/Carpeta.js";
import Historial from "../models/Historial.js";

const historialUsuario = async (req, res) => {

    let carpeta = new Carpeta();
    if(req.usuario) {
        carpeta = await Carpeta.findOne({ usuario: mongoose.Types.ObjectId(req.usuario.id) }).populate({
            path: 'urlEnlaces',
            select: '-autor -password -nombre -__v'
        });
    }

    res.json({ enlaces: carpeta.urlEnlaces, carpetaUsuario: carpeta.nombre });
}

const historialArchivo = async (req, res) => {
    const { idArchivo } = req.params;

    let historial = new Historial();

    try {
        if(idArchivo) {
            historial = await Historial.findOne({ enlace: idArchivo }).select('-_id -enlace').populate({
                path: 'usuarios',
                select: '-_id -password'
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error al obtener el historial' });
    }

    res.json({ historialArchivo: historial })
}

const prueba = (req, res) => {
    return res.json({ prueba: "Funcionando correctamente..." })
}

export {
    historialArchivo,
    historialUsuario,
    prueba
}