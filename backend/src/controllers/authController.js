import supabase from '../supabase/supabaseClient.js';

/**
 * Recuperar senha - Enviar email de reset
 * POST /auth/recuperar-senha
 */
export async function recuperarSenha(req, res) {
    try {
        const { email } = req.body;

        // Validação
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email é obrigatório'
            });
        }

        // Verificar se o usuário existe
        const { data: user, error: userError } = await supabase
            .from('usuarios')
            .select('id, email')
            .eq('email', email)
            .single();

        if (userError || !user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado com este email'
            });
        }

        // Enviar email de recuperação via Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password`
        });

        if (error) {
            console.error('Erro ao enviar email de recuperação:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao enviar email de recuperação',
                error: error.message
            });
        }

        return res.json({
            success: true,
            message: 'Email de recuperação enviado com sucesso!'
        });

    } catch (error) {
        console.error('Erro inesperado:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
}

/**
 * Resetar senha - Confirmar nova senha
 * POST /auth/resetar-senha
 */
export async function resetarSenha(req, res) {
    try {
        const { token, nova_senha } = req.body;

        // Validação
        if (!token || !nova_senha) {
            return res.status(400).json({
                success: false,
                message: 'Token e nova senha são obrigatórios'
            });
        }

        // Validar força da senha
        if (nova_senha.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'A senha deve ter pelo menos 6 caracteres'
            });
        }

        // Resetar senha via Supabase
        const { error } = await supabase.auth.updateUser({
            password: nova_senha
        });

        if (error) {
            console.error('Erro ao resetar senha:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro ao resetar senha',
                error: error.message
            });
        }

        return res.json({
            success: true,
            message: 'Senha alterada com sucesso!'
        });

    } catch (error) {
        console.error('Erro inesperado:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
}

/**
 * Verificar token de recuperação
 * POST /auth/verificar-token
 */
export async function verificarToken(req, res) {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Token é obrigatório'
            });
        }

        // Verificar se o token é válido
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(400).json({
                success: false,
                message: 'Token inválido ou expirado'
            });
        }

        return res.json({
            success: true,
            message: 'Token válido',
            user: {
                id: data.user.id,
                email: data.user.email
            }
        });

    } catch (error) {
        console.error('Erro inesperado:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
} 