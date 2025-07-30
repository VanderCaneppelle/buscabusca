import express from 'express';
import { recuperarSenha, resetarSenha, verificarToken } from '../controllers/authController.js';

const router = express.Router();

// Rota para solicitar recuperação de senha
router.post('/recuperar-senha', recuperarSenha);

// Rota para resetar senha
router.post('/resetar-senha', resetarSenha);

// Rota para verificar token
router.post('/verificar-token', verificarToken);

// Rota para redirecionamento do email (GET)
router.get('/reset-password', (req, res) => {
    const { access_token, refresh_token, type } = req.query;
    
    // Criar uma página HTML que redireciona para o app
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperação de Senha - Busca Busca Imóveis</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
                margin: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                max-width: 400px;
                width: 100%;
            }
            .icon {
                font-size: 60px;
                margin-bottom: 20px;
            }
            h1 {
                margin: 0 0 20px 0;
                font-size: 24px;
            }
            p {
                margin: 0 0 30px 0;
                line-height: 1.6;
                opacity: 0.9;
            }
            .button {
                background: #4CAF50;
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 10px;
                font-size: 16px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                margin: 10px;
                transition: background 0.3s;
            }
            .button:hover {
                background: #45a049;
            }
            .secondary {
                background: transparent;
                border: 2px solid white;
            }
            .secondary:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            .tokens {
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">🏠</div>
            <h1>Busca Busca Imóveis</h1>
            <p>Clique no botão abaixo para abrir o app e redefinir sua senha:</p>
            
            <a href="buscabusca://reset-password?access_token=${access_token || ''}&refresh_token=${refresh_token || ''}&type=${type || ''}" 
               class="button">
                🔓 Abrir App
            </a>
            
            <br>
            <a href="https://play.google.com/store/apps/details?id=com.buscabusca.app" 
               class="button secondary">
                📱 Baixar App
            </a>
            
            <div class="tokens">
                <p>Tokens recebidos:</p>
                <p>Access Token: ${access_token || 'N/A'}</p>
                <p>Refresh Token: ${refresh_token || 'N/A'}</p>
                <p>Type: ${type || 'N/A'}</p>
            </div>
        </div>
        
        <script>
            // Tentar abrir o app automaticamente após 2 segundos
            setTimeout(() => {
                window.location.href = 'buscabusca://reset-password?access_token=${access_token || ''}&refresh_token=${refresh_token || ''}&type=${type || ''}';
            }, 2000);
            
            // Se não conseguir abrir o app, mostrar mensagem
            setTimeout(() => {
                document.querySelector('.container').innerHTML += '<p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">Se o app não abriu automaticamente, clique no botão "Abrir App" acima.</p>';
            }, 3000);
        </script>
    </body>
    </html>
    `;
    
    res.send(html);
});

export default router; 