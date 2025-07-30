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
            .qr-section {
                margin-top: 30px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">🏠</div>
            <h1>Busca Busca Imóveis</h1>
            <p>Clique no botão abaixo para abrir o app e redefinir sua senha:</p>
            
            <a href="#" id="openAppBtn" class="button">
                🔓 Abrir App
            </a>
            
            <br>
            <a href="https://play.google.com/store/apps/details?id=com.buscabusca.app" 
               class="button secondary">
                📱 Baixar App
            </a>
            
            <div class="qr-section">
                <p><strong>Para testar com Expo Go:</strong></p>
                <p>1. Abra o Expo Go no seu celular</p>
                <p>2. Escaneie o QR Code que aparece no terminal</p>
                <p>3. Depois clique em "Abrir App" acima</p>
            </div>
            
            <div class="tokens">
                <p>Tokens recebidos:</p>
                <p>Access Token: ${access_token || 'N/A'}</p>
                <p>Refresh Token: ${refresh_token || 'N/A'}</p>
                <p>Type: ${type || 'N/A'}</p>
            </div>
        </div>
        
        <script>
            // Tentar diferente URLs do Expo Go
            const expoUrls = [
                'exp://192.168.1.10:8081/--/reset-password?access_token=${access_token || ''}&refresh_token=${refresh_token || ''}&type=${type || ''}',
                'exp://192.168.24.1:8081/--/reset-password?access_token=${access_token || ''}&refresh_token=${refresh_token || ''}&type=${type || ''}',
                'exp://localhost:8081/--/reset-password?access_token=${access_token || ''}&refresh_token=${refresh_token || ''}&type=${type || ''}',
                'buscabusca://reset-password?access_token=${access_token || ''}&refresh_token=${refresh_token || ''}&type=${type || ''}'
            ];
            
            let currentUrlIndex = 0;
            
            function tryOpenApp() {
                if (currentUrlIndex < expoUrls.length) {
                    window.location.href = expoUrls[currentUrlIndex];
                    currentUrlIndex++;
                    
                    // Tentar próxima URL após 1 segundo
                    setTimeout(tryOpenApp, 1000);
                } else {
                    // Se nenhuma URL funcionou, mostrar mensagem
                    document.querySelector('.container').innerHTML += '<p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">Se o app não abriu automaticamente, certifique-se de que o Expo Go está aberto e tente novamente.</p>';
                }
            }
            
            // Configurar botão
            document.getElementById('openAppBtn').onclick = function(e) {
                e.preventDefault();
                currentUrlIndex = 0;
                tryOpenApp();
            };
            
            // Tentar abrir automaticamente após 2 segundos
            setTimeout(() => {
                tryOpenApp();
            }, 2000);
        </script>
    </body>
    </html>
    `;

    res.send(html);
});

// Rota para confirmação de email (GET)
router.get('/confirm-email', (req, res) => {
    const { access_token, refresh_token, type } = req.query;

    // Criar uma página HTML que redireciona para o app
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de Email - Busca Busca Imóveis</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px 20px;
                background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
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
                background: #2563eb;
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
                background: #1d4ed8;
            }
            .secondary {
                background: transparent;
                border: 2px solid white;
            }
            .secondary:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            .success-message {
                background: rgba(255, 255, 255, 0.2);
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 30px;
            }
            .qr-section {
                margin-top: 30px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">✅</div>
            <h1>Email Confirmado!</h1>
            
            <div class="success-message">
                <p>🎉 Seu email foi confirmado com sucesso!</p>
                <p>Agora você pode fazer login no app.</p>
            </div>
            
            <p>Clique no botão abaixo para abrir o app:</p>
            
            <a href="#" id="openAppBtn" class="button">
                🚀 Abrir App
            </a>
            
            <br>
            <a href="https://play.google.com/store/apps/details?id=com.buscabusca.app" 
               class="button secondary">
                📱 Baixar App
            </a>
            
            <div class="qr-section">
                <p><strong>Para testar com Expo Go:</strong></p>
                <p>1. Abra o Expo Go no seu celular</p>
                <p>2. Escaneie o QR Code que aparece no terminal</p>
                <p>3. Depois clique em "Abrir App" acima</p>
            </div>
        </div>
        
        <script>
            // Tentar diferentes URLs do Expo Go
            const expoUrls = [
                'exp://192.168.1.10:8081/--/login?email_confirmed=true',
                'exp://192.168.24.1:8081/--/login?email_confirmed=true',
                'exp://localhost:8081/--/login?email_confirmed=true',
                'buscabusca://login?email_confirmed=true'
            ];
            
            let currentUrlIndex = 0;
            
            function tryOpenApp() {
                if (currentUrlIndex < expoUrls.length) {
                    window.location.href = expoUrls[currentUrlIndex];
                    currentUrlIndex++;
                    
                    // Tentar próxima URL após 1 segundo
                    setTimeout(tryOpenApp, 1000);
                } else {
                    // Se nenhuma URL funcionou, mostrar mensagem
                    document.querySelector('.container').innerHTML += '<p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">Se o app não abriu automaticamente, certifique-se de que o Expo Go está aberto e tente novamente.</p>';
                }
            }
            
            // Configurar botão
            document.getElementById('openAppBtn').onclick = function(e) {
                e.preventDefault();
                currentUrlIndex = 0;
                tryOpenApp();
            };
            
            // Tentar abrir automaticamente após 2 segundos
            setTimeout(() => {
                tryOpenApp();
            }, 2000);
        </script>
    </body>
    </html>
    `;

    res.send(html);
});

export default router; 