import express from 'express';
import {
getPacientes,
createPaciente,
getPaciente,
updatePaciente,
deletePaciente
} from '../controllers/pacienteControllers.js';

import {  protectCookie } from '../middlewares/auth.js';

const router = express.Router();
const protect = protectCookie; // renomeando para manter consistência   

router.get('/', protect, getPacientes);  // no caso eu sigo a minha rota padrão já configurada
router.post('/', protect, createPaciente);
router.get('/:id', protect, getPaciente);
router.put('/:id', protect, updatePaciente);
router.delete('/:id', protect, deletePaciente);

export default router;
