import express from 'express';
import { recuperarSenha, resetarSenha, verificarToken } from '../controllers/authController.js';

const router = express.Router();

// Rota para solicitar recuperação de senha
router.post('/recuperar-senha', recuperarSenha);

// Rota para resetar senha
router.post('/resetar-senha', resetarSenha);

// Rota para verificar token
router.post('/verificar-token', verificarToken);

export default router; 