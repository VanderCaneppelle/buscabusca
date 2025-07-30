import express from 'express';
import dotenv from 'dotenv';
import anuncioRoutes from './routes/anuncioRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS básico (para desenvolvimento)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Rota de teste
app.get('/', (req, res) => {
    res.json({
        message: '🚀 BuscaBusca API - Backend para anúncios imobiliários',
        version: '1.0.0',
        status: 'online',
        endpoints: {
            anuncios: '/anuncios',
            docs: 'Documentação em breve...'
        }
    });
});

// Rotas da API
app.use('/anuncios', anuncioRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/auth', authRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Erro interno'
    });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Rota ${req.originalUrl} não encontrada`
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log('🚀 Servidor iniciado com sucesso!');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📅 Data: ${new Date().toLocaleString('pt-BR')}`);
    console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log('📋 Endpoints disponíveis:');
    console.log(`   GET  / - Status da API`);
    console.log(`   GET  /anuncios/listar - Listar anúncios`);
    console.log(`   GET  /anuncios/:id - Buscar anúncio por ID`);
    console.log(`   POST /anuncios/criar - Criar anúncio (autenticado)`);
    console.log(`   POST /anuncios/aprovar/:id - Aprovar anúncio (autenticado)`);
}); 