import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id; //extraer el id del paciente

    try {
        const pacienteAlamecinado = await paciente.save();
        res.json(pacienteAlamecinado);
    } catch (error) {
        console.log(error);
    };
};

const obtenerPacientes =  async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
    res.json(pacientes);
};

const obtenerPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json({msg: 'Paciente no encontrado'});
    };

    if(paciente.veterinario._id.toString() !== req.veterinario.id.toString()){ //cuando compares id´s de mongoDB usa el method toString para poder hacerlo
        return res.json({msg: 'Acción no valida'});
    };

        res.json(paciente);
};

const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json({msg: 'Paciente no encontrado'});
    };

    if(paciente.veterinario._id.toString() !== req.veterinario.id.toString()){
        res.json({msg: 'Acción no valida'});
    };

        //actualizar paciente
        paciente.nombre = req.body.nombre || paciente.nombre;
        paciente.propietario = req.body.propietario || paciente.propietario;
        paciente.email = req.body.email || paciente.email;
        paciente.fecha = req.body.fecha || paciente.fecha;
        paciente.telefono = req.body.telefono || paciente.telefono;
        paciente.edad = req.body.edad || paciente.edad;
        paciente.sintomas = req.body.sintomas || paciente.sintomas;

        try {
            const pacienteActualizado = await paciente.save();
            res.json(pacienteActualizado);
        } catch (error) {
            console.log(error);
        };
};

const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json({msg: 'Paciente no encontrado'});
    };

    if(paciente.veterinario._id.toString() !== req.veterinario.id.toString()){
        res.json({msg: 'Acción no valida'});
    };

    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente eliminado'});
    } catch (error) {
        console.log(error);
    };
};



export  { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } ;