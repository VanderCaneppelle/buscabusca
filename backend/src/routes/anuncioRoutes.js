import express from 'express';
import {
    criarAnuncio,
    listarAnuncios,
    aprovarAnuncio,
    buscarAnuncioPorId
} from '../controllers/anuncioController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotas públicas
router.get('/listar', listarAnuncios);
router.get('/:id', buscarAnuncioPorId);

// Rotas protegidas (requerem autenticação)
router.post('/criar', authMiddleware, criarAnuncio);
router.post('/aprovar/:id', authMiddleware, aprovarAnuncio);

export default router; 