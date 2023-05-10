import emailRegistro from "../helpers/emailRegistro.js";
import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarID from "../helpers/generarID.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    const { email, nombre } = req.body

    //prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email}); //object enhancer
    if (existeUsuario){
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({msg: error.message});
    }
    
    try {
        //guadar nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //enviar el email antes de mostrar el mensaje de respuesta
        emailRegistro({email, nombre, token: veterinarioGuardado.token});

        res.json(veterinarioGuardado);
    } catch (error) {
        console.log(error);
    };
};

const perfil = (req, res) => {
    const { veterinario } = req;

    res.json(veterinario);
};

const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar =  await Veterinario.findOne({ token });

    if(!usuarioConfirmar){
        const error = new Error('Token no valido');
        
        return res.status(404).json({msg: error.message});
    };
    
    try {
        usuarioConfirmar.token =  null;
        usuarioConfirmar.confirmado = true;
        await usuarioConfirmar.save();

        res.json({msg: 'Usuario confirmado correctamente'});
    } catch (error) {
        console.log(error);
    };
};

//funcion para identificar a los usuarios
const autenticar = async (req, res) => {
    const { email, password } = req.body;

    //comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});

    if(!usuario) {
        const error = new Error('Este usuario no existe');

        return res.status(401).json({msg: error.message});
    };

    //comprobar si el usuario esta autenticado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    };

    //revisar el password
    if( await usuario.comprobarPassword(password)){
        
        //autenticar al usuario
        res.json({
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        });
    } else {
        const error = new Error('Password incorrecto');
        return res.status(403).json({msg: error.message});
    };
};

const olvidePassword = async (req, res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario){
        const error = new Error('Este usuario no existe');
        return res.status(400).json({msg: error.message});
    };

    try {
        existeVeterinario.token = generarID();
        await existeVeterinario.save();

        //enviar el email con instrucciones de recuperacion
        emailOlvidePassword({
            nombre: existeVeterinario.nombre,
            email,
            token: existeVeterinario.token});

        res.json({msg: 'Hemos enviado un email con las instrucciones para recuperar tu cuenta'});
    } catch (error) {
        console.log(error);
    };
};

const comprobarToken = async (req, res) => {
    const { token } = req.params;
    
    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido) {
        //token valido
        res.json({msg: 'Token valido, el usuario existe'})
    }else {
        const error = new Error('Token no valido');
        return res.status(400).json({msg: error.message});
    };
};

const nuevoPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario){
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    };

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: 'Password modficado correctamente'});
    } catch (error) {
        console.log(error);
    }
};

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);
    if(!veterinario){
        const error = new Error ('Hubo un error');
        return res.status(400).json({msg: error.message});
    };

    const { email } = req.body;
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email});
        if(existeEmail){
            const error = new Error ('Este Email ya está registrado con otra cuenta');
            return res.status(400).json({msg: error.message});
        };
    };
    
    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error);
    }
};

const actualizarPassword = async (req, res) => {
    //leer los datos
    const { id } = req.veterinario;
    const { pwd_nuevo, pwd_actual } = req.body;

    //comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id);
    if(!veterinario){
        const error = new Error ('Hubo un error');
        return res.status(400).json({msg: error.message});
    };

    //comprobar password
    if(await veterinario.comprobarPassword(pwd_actual)){
        //almacenar el nuevo password
        veterinario.password = pwd_nuevo;

        await veterinario.save();
        res.json({msg: 'Password Nuevo Almacenado Correctamente'})
    } else {
        const error = new Error ('El Password Actual Es Incorrecto');
        return res.status(400).json({msg: error.message});
    };
};

export { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword };