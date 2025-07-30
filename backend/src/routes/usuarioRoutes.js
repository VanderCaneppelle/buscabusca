import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import supabase from '../supabase/supabaseClient.js';

const router = express.Router();

// Rota para criar usuário no backend
router.post('/criar', async (req, res) => {
    try {
        const { nome, email, telefone, is_corretor, creci } = req.body;

        // Buscar o usuário no Supabase Auth
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

        // Inserir dados do usuário na tabela usuarios
        const { data, error } = await supabase
            .from('usuarios')
            .insert([
                {
                    id: user.id,
                    nome,
                    email,
                    telefone: telefone || null,
                    is_corretor: is_corretor || false,
                    creci: is_corretor ? creci : null,
                    plano_atual: 'gratuito',
                    limite_anuncios_ativos: 0,
                    anuncios_ativos_count: 0
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({ message: 'Erro ao criar usuário no backend' });
        }

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: data
        });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para controlar sessão única
router.post('/controlar-sessao', async (req, res) => {
    try {
        const { user_id, session_token } = req.body;

        // Invalidar sessões anteriores
        const { error: deleteError } = await supabase
            .from('sessoes_ativas')
            .delete()
            .eq('user_id', user_id);

        if (deleteError) {
            console.error('Erro ao deletar sessões anteriores:', deleteError);
        }

        // Inserir nova sessão
        const { error: insertError } = await supabase
            .from('sessoes_ativas')
            .insert([
                {
                    user_id,
                    session_token,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
                }
            ]);

        if (insertError) {
            console.error('Erro ao inserir nova sessão:', insertError);
            return res.status(500).json({ message: 'Erro ao controlar sessão' });
        }

        res.json({ message: 'Sessão controlada com sucesso' });
    } catch (error) {
        console.error('Erro ao controlar sessão:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para buscar perfil do usuário
router.get('/perfil', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error) {
            console.error('Erro ao buscar perfil:', error);
            return res.status(500).json({ message: 'Erro ao buscar perfil' });
        }

        res.json({ user: data });
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para atualizar perfil
router.put('/perfil', authMiddleware, async (req, res) => {
    try {
        const { nome, telefone, is_corretor, creci } = req.body;

        const { data, error } = await supabase
            .from('usuarios')
            .update({
                nome,
                telefone: telefone || null,
                is_corretor: is_corretor || false,
                creci: is_corretor ? creci : null,
                updated_at: new Date()
            })
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar perfil:', error);
            return res.status(500).json({ message: 'Erro ao atualizar perfil' });
        }

        res.json({
            message: 'Perfil atualizado com sucesso',
            user: data
        });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

export default router; 