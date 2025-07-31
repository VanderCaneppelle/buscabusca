import express from 'express';
import { recuperarSenha, resetarSenha, verificarToken } from '../controllers/authController.js';
import supabase from '../supabase/supabaseClient.js';

const router = express.Router();

// Rota para solicitar recuperação de senha
router.post('/recuperar-senha', recuperarSenha);

// Rota para resetar senha
router.post('/reset-password', resetarSenha);

// Rota para verificar token
router.post('/verificar-token', verificarToken);

// Rota para redirecionamento do email (GET)
router.get('/reset-password', async (req, res) => {
    const { access_token, refresh_token, type, error, error_description } = req.query;

    // Se há erro, mostrar mensagem
    if (error) {
        return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Erro - Busca Busca Imóveis</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f44336; color: white; }
                .container { background: rgba(255,255,255,0.1); padding: 40px; border-radius: 20px; max-width: 400px; margin: 0 auto; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>❌ Erro</h1>
                <p>${error_description || 'Ocorreu um erro ao processar sua solicitação.'}</p>
                <p><a href="https://play.google.com/store/apps/details?id=com.buscabusca.app" style="color: white;">📱 Abrir App</a></p>
            </div>
        </body>
        </html>
        `);
    }

    // Se não há tokens, tentar extrair do hash do Supabase
    let finalAccessToken = access_token;
    let finalRefreshToken = refresh_token;
    let finalType = type;

    // Se não temos tokens mas temos um hash do Supabase, tentar extrair
    if (!finalAccessToken && req.url.includes('#')) {
        try {
            // O Supabase pode enviar os tokens no fragment da URL
            const hash = req.url.split('#')[1];
            const params = new URLSearchParams(hash);
            finalAccessToken = params.get('access_token');
            finalRefreshToken = params.get('refresh_token');
            finalType = params.get('type') || 'recovery';
        } catch (e) {
            console.error('Erro ao extrair tokens do hash:', e);
        }
    }

    // Se ainda não temos tokens, tentar usar o session do Supabase
    if (!finalAccessToken) {
        try {
            // Tentar obter a sessão atual do Supabase
            const { data: { session }, error } = await supabase.auth.getSession();
            if (session && !error) {
                finalAccessToken = session.access_token;
                finalRefreshToken = session.refresh_token;
                finalType = 'recovery';
            }
        } catch (e) {
            console.error('Erro ao obter sessão:', e);
        }
    }

    console.log('Tokens finais:', {
        access_token: finalAccessToken ? 'presente' : 'ausente',
        refresh_token: finalRefreshToken ? 'presente' : 'ausente',
        type: finalType
    });

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
                <p>Access Token: ${finalAccessToken || 'N/A'}</p>
                <p>Refresh Token: ${finalRefreshToken || 'N/A'}</p>
                <p>Type: ${finalType || 'N/A'}</p>
            </div>
        </div>
        
        <script>
            // Tentar diferente URLs do Expo Go
            const expoUrls = [
                'exp://192.168.1.10:8081/--/reset-password?access_token=${finalAccessToken || ''}&refresh_token=${finalRefreshToken || ''}&type=${finalType || ''}',
                'exp://192.168.24.1:8081/--/reset-password?access_token=${finalAccessToken || ''}&refresh_token=${finalRefreshToken || ''}&type=${finalType || ''}',
                'exp://localhost:8081/--/reset-password?access_token=${finalAccessToken || ''}&refresh_token=${finalRefreshToken || ''}&type=${finalType || ''}',
                'buscabusca://reset-password?access_token=${finalAccessToken || ''}&refresh_token=${finalRefreshToken || ''}&type=${finalType || ''}'
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

// Rota para confirmação de email
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

// Rota para lidar com callback do Supabase
router.get('/callback', async (req, res) => {
    try {
        console.log('🔗 Callback do Supabase recebido');
        console.log('📋 Query params:', req.query);
        console.log('🔗 Hash:', req.url.split('#')[1]);

        // Extrair tokens do hash da URL
        const hash = req.url.split('#')[1];
        if (hash) {
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');
            const type = params.get('type');

            console.log('🎫 Tokens extraídos:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

            if (accessToken && type === 'recovery') {
                // Redirecionar para o app com o token
                const deepLink = `buscabusca://reset-password?access_token=${accessToken}`;
                console.log('📱 Redirecionando para:', deepLink);

                return res.send(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Redirecionando...</title>
                        <meta charset="utf-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style>
                            body { 
                                font-family: Arial, sans-serif; 
                                text-align: center; 
                                padding: 50px; 
                                background: #f5f5f5; 
                            }
                            .container { 
                                background: white; 
                                padding: 30px; 
                                border-radius: 10px; 
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
                                max-width: 400px; 
                                margin: 0 auto; 
                            }
                            .btn { 
                                background: #007AFF; 
                                color: white; 
                                padding: 15px 30px; 
                                border: none; 
                                border-radius: 8px; 
                                font-size: 16px; 
                                cursor: pointer; 
                                text-decoration: none; 
                                display: inline-block; 
                                margin: 10px; 
                            }
                            .btn:hover { background: #0056CC; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>🔄 Redirecionando para o App</h2>
                            <p>Aguarde enquanto abrimos o Busca Busca Imóveis...</p>
                            <a href="${deepLink}" class="btn">Abrir App</a>
                            <p style="font-size: 12px; color: #666; margin-top: 20px;">
                                Se o app não abrir automaticamente, clique no botão acima
                            </p>
                        </div>
                        <script>
                            // Tentar abrir o app automaticamente
                            setTimeout(() => {
                                window.location.href = '${deepLink}';
                            }, 1000);
                        </script>
                    </body>
                    </html>
                `);
            }
        }

        // Fallback se não conseguir extrair tokens
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Erro no Redirecionamento</title>
                <meta charset="utf-8">
            </head>
            <body>
                <h2>❌ Erro no Redirecionamento</h2>
                <p>Não foi possível processar o link de recuperação de senha.</p>
                <p>Por favor, tente novamente ou entre em contato com o suporte.</p>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('❌ Erro no callback:', error);
        res.status(500).send('Erro interno do servidor');
    }
});

export default router; 