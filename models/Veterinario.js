import mongoose from "mongoose";
import generarID from "../helpers/generarID.js";
import bcrypt from "bcrypt";

const veterinarioSchema = mongoose.Schema({ //mongoose automaticamente asigna el ID
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token:{
        type: String,
        default: generarID()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

veterinarioSchema.pre('save', async function(next) {
    if(!this.isModified('password')){ //metodo de mongoose
        next();
    };
    const salt = await bcrypt.genSalt(10);  //rondas de hashing
    this.password = await bcrypt.hash(this.password, salt);  //bcrypt sirve para hasing y para rondas
});

veterinarioSchema.methods.comprobarPassword =  async function(passwordFormulario) { //metodos unicos para veterinaios con .methods
    return await bcrypt.compare(passwordFormulario, this.password); //coteja los passwords y retorna un boolean
};

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);

export default Veterinario;
