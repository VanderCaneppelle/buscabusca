import supabase from '../supabase/supabaseClient.js';

/**
 * Criar um novo anúncio
 * POST /anuncios/criar
 */
export async function criarAnuncio(req, res) {
    try {
        const { titulo, descricao, preco, endereco, tipo_imovel, quartos, banheiros, area } = req.body;
        const userId = req.user.id; // Vem do middleware de autenticação

        // Validação básica
        if (!titulo || !descricao || !preco) {
            return res.status(400).json({
                success: false,
                message: 'Título, descrição e preço são obrigatórios'
            });
        }

        const novoAnuncio = {
            titulo,
            descricao,
            preco: parseFloat(preco),
            endereco: endereco || null,
            tipo_imovel: tipo_imovel || 'residencial',
            quartos: quartos ? parseInt(quartos) : null,
            banheiros: banheiros ? parseInt(banheiros) : null,
            area: area ? parseFloat(area) : null,
            user_id: userId,
            aprovado: false,
            created_at: new Date().toISOString()
        };

        const { data, error } = await supabase
            .from('anuncios')
            .insert([novoAnuncio])
            .select();

        if (error) {
            console.error('Erro ao criar anúncio:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: error.message
            });
        }

        return res.status(201).json({
            success: true,
            message: 'Anúncio criado com sucesso! Aguardando aprovação.',
            anuncio: data[0]
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
 * Listar anúncios aprovados
 * GET /anuncios/listar
 */
export async function listarAnuncios(req, res) {
    try {
        const { page = 1, limit = 10, tipo_imovel, preco_min, preco_max } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('anuncios')
            .select('*')
            .eq('aprovado', true)
            .order('created_at', { ascending: false });

        // Filtros opcionais
        if (tipo_imovel) {
            query = query.eq('tipo_imovel', tipo_imovel);
        }
        if (preco_min) {
            query = query.gte('preco', parseFloat(preco_min));
        }
        if (preco_max) {
            query = query.lte('preco', parseFloat(preco_max));
        }

        // Paginação
        query = query.range(offset, offset + limit - 1);

        const { data, error, count } = await query;

        if (error) {
            console.error('Erro ao listar anúncios:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: error.message
            });
        }

        return res.json({
            success: true,
            anuncios: data,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count || data.length
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

/**
 * Aprovar um anúncio (apenas admin)
 * POST /anuncios/aprovar/:id
 */
export async function aprovarAnuncio(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Verificar se o usuário é admin (implementar lógica de admin)
        // Por enquanto, qualquer usuário autenticado pode aprovar
        if (!userId) {
            return res.status(403).json({
                success: false,
                message: 'Acesso negado'
            });
        }

        const { data, error } = await supabase
            .from('anuncios')
            .update({
                aprovado: true,
                aprovado_em: new Date().toISOString(),
                aprovado_por: userId
            })
            .eq('id', id)
            .select();

        if (error) {
            console.error('Erro ao aprovar anúncio:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: error.message
            });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Anúncio não encontrado'
            });
        }

        return res.json({
            success: true,
            message: 'Anúncio aprovado com sucesso!',
            anuncio: data[0]
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
 * Buscar anúncio por ID
 * GET /anuncios/:id
 */
export async function buscarAnuncioPorId(req, res) {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('anuncios')
            .select('*')
            .eq('id', id)
            .eq('aprovado', true)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return res.status(404).json({
                    success: false,
                    message: 'Anúncio não encontrado'
                });
            }

            console.error('Erro ao buscar anúncio:', error);
            return res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: error.message
            });
        }

        return res.json({
            success: true,
            anuncio: data
        });

    } catch (error) {
        console.error('Erro inesperado:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
} 