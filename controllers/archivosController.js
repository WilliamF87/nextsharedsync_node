import multer from "multer";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import shortid from "shortid";
import fs from "fs";
import Enlace from "../models/Enlace.js";
import Historial from "../models/Historial.js";
import Carpeta from "../models/Carpeta.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const subirArchivo = async (req, res, next) => {
    
    const folderAnonimo = 'YyjQ4g2es';

    let folderPath = path.join(__dirname, "..", "uploads", folderAnonimo);
    
    if(req.usuario) {
        const carpeta = await Carpeta.findOne({ usuario: mongoose.Types.ObjectId(req.usuario.id) });
        folderPath = path.join(__dirname, "..", "uploads", carpeta.nombre);
    }
  
    if(!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
    
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, folderPath);
        },
        filename: (req, file, cb) => {
            const extension = file.originalname
                .substring(
                    file.originalname.lastIndexOf('.'),
                    file.originalname.length
                );
            cb(null, `${shortid.generate()}${extension}`);
        }
    });

    const configMulter = {
        limits: { fileSize: req.usuario ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: fileStorage
    }

    
    const upload = multer(configMulter).single('archivo');
    
    upload(req, res, async error => {
        if(!error) {
            res.json({ archivo: req.file.filename });
        } else {
            console.log(error);
            return next();
        }
    });
}

const eliminarArchivo = async (req, res) => {
    
    const { carpeta, archivoDescarga: archivo } = req.body;

    try {
        fs.unlinkSync(__dirname + `/../uploads/${carpeta}/${archivo}`);
    } catch (error) {
        console.log(error);
    }
}

const descargar = async (req, res) => {
    // Obtener el enlace
    const { carpeta, archivo, nombreOriginal } = req.params;
    
    const enlace = await Enlace.findOne({ nombre: archivo });
    if(!enlace || !enlace.descargas > 0) {
        return res.status(404).send("El enlace no existe");
    }

    // Ruta exacta del archivo original
    const rutaOriginal = `${__dirname}/../uploads/${carpeta}/${archivo}`;

    // Crear un flujo de lectura desde el archivo original
    // const readStream = fs.createReadStream(rutaOriginal);

    // // Configurar el encabezado para la respuesta de descarga con el nuevo nombre
    // res.setHeader('Content-disposition', `attachment; filename="${nombreOriginal}"`);

    // // Pipe (conectar) el flujo de lectura al flujo de escritura de la respuesta
    // readStream.pipe(res);

    res.download(rutaOriginal);
    // res.send: sirve para enviar una vista html
}

const registrarDescarga = async (req, res, next) => {

    const { url } = req.body;

    const enlace = await Enlace.findOne({ url: url });

    const historial = await Historial.findOne({ enlace: enlace._id }).populate('enlace');
    
    const registroHistorial = async () => {
        historial.descargado++;
        historial.ultimaDescarga = Date.now();
    
        let usuarios = historial.usuarios;
        
        if(req.usuario && !usuarios.includes(req.usuario.id)) {
            usuarios.push(req.usuario.id);
            historial.usuarios = usuarios;    
        }
    
        await historial.save();
    }

    const registroDescarga = async () => {
        const { descargas } = enlace;
    
        if(descargas > 0) {
            enlace.descargas--;
            await enlace.save();
    
            // Si las descargas son iguales a 1: borrar el archivo
            if(descargas === 1) {
                next();
            }
        }
    }

    if(!historial || !historial?.enlace.autor) {
        await registroDescarga();
    }

    if(historial && historial.enlace.autor !== null && req.usuario?.id !== historial.enlace.autor.toString()) {
        await registroHistorial();

        await registroDescarga();
    }
}

export {
    subirArchivo,
    eliminarArchivo,
    descargar,
    registrarDescarga
}