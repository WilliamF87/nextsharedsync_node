import mongoose from "mongoose";

const Schema = mongoose.Schema;

const carpetaSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        unique: true,
        default: null
    },
    urlEnlaces: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Enlace"
        }
    ],
});

const Carpeta = mongoose.model("Carpeta", carpetaSchema);
export default Carpeta;
