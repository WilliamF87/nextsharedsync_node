import { validationResult } from "express-validator"
import Enlace from "../models/Enlace.js";
import shortid from "shortid";
import bcrypt from "bcryptjs";
import Historial from "../models/Historial.js";
import Carpeta from "../models/Carpeta.js";
import mongoose from "mongoose";

const nuevoEnlace = async (req, res, next) => {

    // Revisar si hay errores
    const errores = validationResult(req);

    if(!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array( )});
    }

    const { nombre_original, nombre } = req.body;

    // Crear un objeto de enlace
    const enlace = new Enlace();

    enlace.url = shortid.generate();
    enlace.nombre = nombre;
    enlace.nombre_original = nombre_original;

    // Si el usuario está registrado
    if(req.usuario) {
        const { password, descargas } = req.body;

        // Asignar al enlace el número de descargas
        if(descargas) {
            enlace.descargas = descargas;
        }

        // Asignar un password
        if(password) {
            const salt = await bcrypt.genSalt(10);
            enlace.password = await bcrypt.hash(password, salt);
        }

        // Asignar el autor
        enlace.autor = req.usuario.id;
    }

    // Almacenar en la DB
    try {
        const enlaceGuardado = await enlace.save();
    
        const carpeta = await asignarCarpeta(req.usuario, enlaceGuardado);

        nuevoHistorial(enlace.url);

        res.json({url: enlace.url, carpeta: carpeta});
        return next();
    } catch (error) {
        console.log(error);
    }
}

const asignarCarpeta = async (usuario, enlace) => {

    let carpeta = {};

    if(usuario) {
        carpeta = await Carpeta.findOne({ usuario: mongoose.Types.ObjectId(usuario.id) });
    } else {
        carpeta = await Carpeta.findOne({ nombre: "YyjQ4g2es" });
        console.log(carpeta)
        return
    }

    let urlEnlaces = carpeta.urlEnlaces;
    
    urlEnlaces.push(enlace._id);

    await Carpeta.updateOne(
        { _id: carpeta._id },
        { $set: { urlEnlaces: urlEnlaces } }
    )
    .then(resultado => {
        // console.log('Resultado:', resultado);
    })
    .catch(error => {
        console.error('Error al actualizar carpeta:', error);
    });

    return carpeta.nombre;
}

const obtenerEnlace = async (req, res, next) => {
    // Verificar si éxiste el enlace
    const { url } = req.params;
    const enlace = await Enlace.findOne({ url });
    
    if(!enlace) {
        res.status(404).json({ msg: 'Este enlace no éxiste'});
        return next();
    }

    // Si el enlace éxiste
    res.json({ archivo: enlace.nombre, nombre: enlace.nombre_original, password: false, descargas: enlace.descargas });

    next();
}

// TODO: revisar si este metodo se está usando y verificar el select
const todosEnlaces = async (req, res) => {
    try {
        // -todos los anlaces (solo su url)
        // Mongo siempre pasa el _id, por eso se quita en el select
        const enlaces = await Enlace.find({}).select('url -_id');
        res.json({enlaces});
    } catch (error) {
        console.log(error);
    }
}

// Retorna si el anlace tiene password o no
const tienePassword = async (req, res, next) => {
    // Verificar si éxiste el enlace
    const { url } = req.params;
    const enlace = await Enlace.findOne({ url });
    
    if(!enlace) {
        return res.status(404).json({ msg: 'Este enlace no éxiste'});
    }

    if(enlace.password) {
        return res.json({ password: true, enlace: enlace.url, nombre: enlace.nombre_original, descargas: enlace.descargas });
    }

    next();
}

const verificarPassword = async (req, res, next) => {
    const { url } = req.params;
    const { password } = req.body;

    // Consultar por el enlace
    const enlace = await Enlace.findOne({ url });

    // Verificar password
    if(bcrypt.compareSync(password, enlace.password)) {
        next();
    } else {
        return res.status(401).json({ msg: 'Password incorrecto' });
    }
}

const nuevoHistorial = async (url) => {
    const historial = new Historial();

    let enlace = {};

    if(url) {
        enlace = await Enlace.findOne({ url: url });
    }

    historial.enlace = enlace._id;

    try {
        await historial.save();
    } catch (error) {
        console.log("Error al guardar historial");
        console.log(error);
    }
}

const enlacesCarpeta = async (req, res) => {

    const { carpeta } = req.params;

    try {
        const carp = await Carpeta.findOne({ nombre: carpeta }).populate("urlEnlaces");

        if(carp) {
            const enlaces = carp.urlEnlaces.map(item => {
                // Elimina el campo _id
                // const { _id, ...resto } = item.toObject();
                // return resto;
                const { url } = item.toObject();
                return { url: url };
            });
    
            return res.json({ enlaces: enlaces });
        } else {
            return res.json({ enlaces: null });
        }
    } catch (error) {
        console.log(error);
    }
}

const editarEnlace = async (req, res, next) => {

    const { id, descargas } = req.body;

    const datos = {
        descargas: descargas
    }

    try {
        const enlace = await Enlace.findById(id);
        
        if(enlace.descargas > 0) {
            const enlaceActualizado = await Enlace.findByIdAndUpdate(id, datos, { new: true }).select('-autor -password -nombre -__v');
    
            if (!enlaceActualizado) {
                return res.status(404).json({ mensaje: 'Enlace no encontrado' });
            }
    
            return res.json(enlaceActualizado);
        }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensaje: 'Error interno del servidor' });       
    }
}

const eliminarEnlace = async (req, res, next) => {
    const { id } = req.body;

    const enlace = await Enlace.findById(id);

    const carpeta = await Carpeta.findOne({ usuario: req.usuario?.id });
    const urlEnlacesModificados = carpeta.urlEnlaces.filter(enlace => enlace.toString() !== id)
    const datos = {
        urlEnlaces: urlEnlacesModificados
    }

    if(req.usuario?.id === enlace.autor.toString()) {
        // Eliminar la entrada en DB
        // await Enlace.findOneAndRemove(req.params.url); // Error: borraba siempre la primera entrada en DB
        try {
            await Enlace.findOneAndDelete({ _id: mongoose.Types.ObjectId(id) });
            await Historial.findOneAndDelete({ enlace: mongoose.Types.ObjectId(id) })
    
            req.body.carpeta = carpeta.nombre;
            req.body.archivoDescarga = enlace.nombre;
            
            await Carpeta.findByIdAndUpdate(carpeta._id, datos, { new: true });

            res.json({ enlaceEliminado: id });

            if(enlace.descargas >= 1) {
                next();
            }            
        } catch (error) {
            console.log(error);
        }
    }
}

export {
    nuevoEnlace,
    obtenerEnlace,
    todosEnlaces,
    tienePassword,
    verificarPassword,
    enlacesCarpeta,
    editarEnlace,
    eliminarEnlace
}