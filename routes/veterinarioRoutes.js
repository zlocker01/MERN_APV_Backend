import express from 'express'; //al importar express tenemos acceso al routing
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPassword, actualizarPerfil } from '../controllers/veterinarioControlles.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

//area publica
router.post('/', registrar);  // post enviar datos al servidor
router.get('/confirmar/:token', confirmar); //parametro dinamico con :
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword); //validar email del usuario
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

//area privada
router.get('/perfil', checkAuth, perfil); //get obtemer datos del servidor
router.put('/perfil/:id', checkAuth, actualizarPerfil); //actualizar el perfil
router.put('/actualizar-password', checkAuth, actualizarPassword);


export default router;