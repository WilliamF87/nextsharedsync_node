import mongoose from "mongoose";

const Schema = mongoose.Schema;

const enlaceSchema = new Schema({
    url: {
        type: String,
        unique: true,
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    nombre_original: {
        type: String,
        required: true
    },
    descargas: {
        type: Number,
        default: 1
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        default: null
    },
    password: {
        type: String,
        default: null
    },
    creado: {
        type: Date,
        default: Date.now()
    }
});

const Enlace = mongoose.model("Enlace", enlaceSchema);
export default Enlace;