import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [9, "El Password debe contener al menos 9 caracteres"],
        validate: [
            {
                validator: function (value) {
                    // Validar al menos dos caracteres especiales
                    return /^(.*[!@#$%^&*_¡?-]){2,}.*$/.test(value);
                },
                message: 'Debe contener al menos dos caracteres especiales (!@#$%^&*_¡?-)'
            },
            {
                validator: function (value) {
                    // Validar al menos una letra mayúscula
                    return /[A-Z]/.test(value);
                },
                message: 'Debe contener al menos una letra mayúscula'
            }

        ]
    },
    confirmado: {
        type: Boolean,
        default: false
    },
    token: {
        type: String,
    }
});

usuarioSchema.pre('save', async function(next) {
    if(!this.isModified("password")) {
        next();
    }
    // Hashear el password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;