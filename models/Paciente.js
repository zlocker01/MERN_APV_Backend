import mongoose from 'mongoose';

const pacienteSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    propietario: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    fecha: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    telefono: {
        type: Number,
        required: true,
    },
    edad: {
        type: String,
        required: true,
    },
    sintomas: {
        type: String,
        required: true,
    },
    veterinario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Veterinario', //referencia al modelo de Veterinario
    },
}, {
    timestamps: true,
});

const Paciente = mongoose.model('Paciente', pacienteSchema);

export default Paciente;