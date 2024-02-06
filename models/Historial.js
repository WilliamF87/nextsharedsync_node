import mongoose from "mongoose";

const Schema = mongoose.Schema;

const historialSchema = new Schema({
    enlace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Enlace",
        required: true,
        unique: true
    },
    descargado: {
        type: Number,
        default: 0
    },
    ultimaDescarga: {
        type: Date,
        default: null
    },
    usuarios: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario"
        }
    ]
});

const Historial = mongoose.model("Historial", historialSchema);
export default Historial;

// Otra forma: insertar un esquema dentro de un array
// const usuarioSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//         lowercase: true,
//         trim: true
//     },
//     nombre: {
//         type: String,
//         required: true,
//         trim: true
//     }
// });

// const historialSchema = new Schema({
//     usuarios: {
//         type: [usuarioSchema],
//         default: []
//     }
// });
