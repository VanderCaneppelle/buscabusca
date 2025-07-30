-- =====================================================
-- COMANDOS DE MANUTENÇÃO - BUSCA BUSCA IMÓVEIS
-- =====================================================
-- Este arquivo contém comandos SQL úteis para 
-- manutenção e administração do banco de dados
-- =====================================================

-- =====================================================
-- 1. LIMPEZA DE DADOS ANTIGOS
-- =====================================================

-- Limpar sessões expiradas
DELETE FROM public.sessoes_ativas 
WHERE expires_at < NOW();

-- Limpar stories expirados
DELETE FROM public.stories 
WHERE expires_at < NOW();

-- Limpar visualizações antigas (mais de 1 ano)
DELETE FROM public.visualizacoes_anuncios 
WHERE created_at < NOW() - INTERVAL '1 year';

-- Limpar anúncios rejeitados antigos (mais de 6 meses)
DELETE FROM public.anuncios 
WHERE status = 'rejeitado' 
AND created_at < NOW() - INTERVAL '6 months';

-- =====================================================
-- 2. ESTATÍSTICAS E RELATÓRIOS
-- =====================================================

-- Total de usuários por plano
SELECT 
    plano_atual,
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as novos_30dias
FROM public.usuarios 
GROUP BY plano_atual 
ORDER BY total_usuarios DESC;

-- Anúncios por status
SELECT 
    status,
    COUNT(*) as total,
    COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as novos_30dias
FROM public.anuncios 
GROUP BY status;

-- Top 10 anúncios mais visualizados
SELECT 
    a.id,
    a.titulo,
    a.visualizacoes,
    u.nome as usuario,
    a.created_at
FROM public.anuncios a
JOIN public.usuarios u ON a.user_id = u.id
WHERE a.status = 'aprovado'
ORDER BY a.visualizacoes DESC
LIMIT 10;

-- Usuários com mais anúncios ativos
SELECT 
    u.nome,
    u.email,
    u.plano_atual,
    u.anuncios_ativos_count,
    u.created_at
FROM public.usuarios u
WHERE u.anuncios_ativos_count > 0
ORDER BY u.anuncios_ativos_count DESC;

-- =====================================================
-- 3. MANUTENÇÃO DE CONTADORES
-- =====================================================

-- Corrigir contador de anúncios ativos para todos os usuários
UPDATE public.usuarios 
SET anuncios_ativos_count = (
    SELECT COUNT(*) 
    FROM public.anuncios 
    WHERE user_id = usuarios.id AND status = 'aprovado'
);

-- Corrigir contador de favoritos para todos os anúncios
UPDATE public.anuncios 
SET favoritos_count = (
    SELECT COUNT(*) 
    FROM public.favoritos 
    WHERE anuncio_id = anuncios.id
);

-- =====================================================
-- 4. ADMINISTRAÇÃO DE USUÁRIOS
-- =====================================================

-- Listar usuários corretores
SELECT 
    id,
    nome,
    email,
    creci,
    plano_atual,
    anuncios_ativos_count
FROM public.usuarios 
WHERE is_corretor = true
ORDER BY nome;

-- Usuários com plano expirado
SELECT 
    id,
    nome,
    email,
    plano_atual,
    data_expiracao
FROM public.usuarios 
WHERE data_expiracao < NOW() 
AND plano_atual != 'gratuito';

-- Usuários inativos (sem login nos últimos 90 dias)
SELECT 
    u.id,
    u.nome,
    u.email,
    u.plano_atual,
    u.created_at,
    MAX(s.created_at) as ultimo_login
FROM public.usuarios u
LEFT JOIN public.sessoes_ativas s ON u.id = s.user_id
GROUP BY u.id, u.nome, u.email, u.plano_atual, u.created_at
HAVING MAX(s.created_at) < NOW() - INTERVAL '90 days'
   OR MAX(s.created_at) IS NULL
ORDER BY ultimo_login;

-- =====================================================
-- 5. ADMINISTRAÇÃO DE ANÚNCIOS
-- =====================================================

-- Anúncios pendentes há mais de 7 dias
SELECT 
    a.id,
    a.titulo,
    a.created_at,
    u.nome as usuario,
    u.email,
    u.is_corretor
FROM public.anuncios a
JOIN public.usuarios u ON a.user_id = u.id
WHERE a.status = 'pendente' 
AND a.created_at < NOW() - INTERVAL '7 days'
ORDER BY a.created_at;

-- Anúncios sem imagens
SELECT 
    a.id,
    a.titulo,
    a.created_at,
    u.nome as usuario
FROM public.anuncios a
JOIN public.usuarios u ON a.user_id = u.id
WHERE NOT EXISTS (
    SELECT 1 FROM public.imagens_anuncios ia 
    WHERE ia.anuncio_id = a.id
)
AND a.status = 'aprovado';

-- Anúncios com preços suspeitos (muito baixos ou altos)
SELECT 
    a.id,
    a.titulo,
    a.preco,
    a.tipo_imovel,
    a.area_construida,
    u.nome as usuario
FROM public.anuncios a
JOIN public.usuarios u ON a.user_id = u.id
WHERE a.status = 'aprovado'
AND (
    a.preco < 10000 OR 
    a.preco > 10000000
)
ORDER BY a.preco;

-- =====================================================
-- 6. BACKUP E RESTORE
-- =====================================================

-- Backup de dados críticos (executar via psql)
-- pg_dump -h your-host -U your-user -d your-db -t public.usuarios -t public.anuncios > backup_critico.sql

-- Backup apenas de estrutura
-- pg_dump -h your-host -U your-user -d your-db --schema-only > estrutura.sql

-- Backup completo
-- pg_dump -h your-host -U your-user -d your-db > backup_completo.sql

-- =====================================================
-- 7. PERFORMANCE E OTIMIZAÇÃO
-- =====================================================

-- Verificar tamanho das tabelas
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public'
ORDER BY tablename, attname;

-- Verificar índices não utilizados
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
AND idx_scan = 0
ORDER BY tablename;

-- Estatísticas de uso das tabelas
SELECT 
    schemaname,
    tablename,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch,
    n_tup_ins,
    n_tup_upd,
    n_tup_del
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY n_tup_ins + n_tup_upd + n_tup_del DESC;

-- =====================================================
-- 8. SEGURANÇA E AUDITORIA
-- =====================================================

-- Verificar usuários com múltiplas sessões ativas
SELECT 
    user_id,
    COUNT(*) as sessoes_ativas,
    MAX(created_at) as ultima_sessao
FROM public.sessoes_ativas
WHERE expires_at > NOW()
GROUP BY user_id
HAVING COUNT(*) > 1
ORDER BY sessoes_ativas DESC;

-- Log de atividades recentes
SELECT 
    'anuncio_criado' as acao,
    a.created_at as data,
    u.nome as usuario,
    a.titulo as detalhes
FROM public.anuncios a
JOIN public.usuarios u ON a.user_id = u.id
WHERE a.created_at >= NOW() - INTERVAL '7 days'

UNION ALL

SELECT 
    'story_criado' as acao,
    s.created_at as data,
    u.nome as usuario,
    s.titulo as detalhes
FROM public.stories s
JOIN public.usuarios u ON s.created_by = u.id
WHERE s.created_at >= NOW() - INTERVAL '7 days'

ORDER BY data DESC;

-- =====================================================
-- 9. COMANDOS DE EMERGÊNCIA
-- =====================================================

-- Desativar todos os anúncios de um usuário específico
-- UPDATE public.anuncios 
-- SET status = 'inativo' 
-- WHERE user_id = 'user-uuid-here';

-- Suspender usuário (mudar para plano gratuito)
-- UPDATE public.usuarios 
-- SET plano_atual = 'gratuito', 
--     data_expiracao = NULL 
-- WHERE id = 'user-uuid-here';

-- Limpar todas as sessões de um usuário
-- DELETE FROM public.sessoes_ativas 
-- WHERE user_id = 'user-uuid-here';

-- =====================================================
-- 10. MONITORAMENTO
-- =====================================================

-- Verificar integridade dos dados
SELECT 
    'usuarios_sem_anuncios' as tipo,
    COUNT(*) as quantidade
FROM public.usuarios u
WHERE NOT EXISTS (
    SELECT 1 FROM public.anuncios a WHERE a.user_id = u.id
)

UNION ALL

SELECT 
    'anuncios_sem_usuario' as tipo,
    COUNT(*) as quantidade
FROM public.anuncios a
WHERE NOT EXISTS (
    SELECT 1 FROM public.usuarios u WHERE u.id = a.user_id
)

UNION ALL

SELECT 
    'favoritos_sem_anuncio' as tipo,
    COUNT(*) as quantidade
FROM public.favoritos f
WHERE NOT EXISTS (
    SELECT 1 FROM public.anuncios a WHERE a.id = f.anuncio_id
);

-- =====================================================
-- FIM DOS COMANDOS DE MANUTENÇÃO
-- ===================================================== 