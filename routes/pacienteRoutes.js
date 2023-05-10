import express  from "express";
import { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente }  from "../controllers/pacienteControlles.js";
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(checkAuth, agregarPaciente).get(checkAuth, obtenerPacientes);
router.route('/:id',).get(checkAuth, obtenerPaciente).put(checkAuth, actualizarPaciente).delete(checkAuth, eliminarPaciente);
//en lugar de PUT puede ser PATCH, pero PUT es mas utilizado

export default router;