-- =====================================================
-- BUSCA BUSCA IMÓVEIS - SCHEMA COMPLETO DO BANCO
-- =====================================================
-- Este arquivo contém todas as tabelas, triggers, 
-- permissões e configurações necessárias para o app
-- =====================================================

-- =====================================================
-- 1. TABELA DE USUÁRIOS (extensão da auth.users)
-- =====================================================
CREATE TABLE public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telefone VARCHAR(20),
    is_corretor BOOLEAN DEFAULT FALSE,
    creci VARCHAR(20), -- CRECI do corretor
    plano_atual VARCHAR(20) DEFAULT 'gratuito', -- gratuito, bronze, prata, ouro
    data_assinatura TIMESTAMP WITH TIME ZONE,
    data_expiracao TIMESTAMP WITH TIME ZONE,
    limite_anuncios_ativos INTEGER DEFAULT 0,
    anuncios_ativos_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- =====================================================
-- 2. TABELA DE PLANOS
-- =====================================================
CREATE TABLE public.planos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE, -- gratuito, bronze, prata, ouro
    descricao TEXT,
    preco_mensal NUMERIC(10,2),
    preco_anual NUMERIC(10,2),
    limite_anuncios_ativos INTEGER NOT NULL,
    recursos TEXT[], -- array com recursos do plano
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Inserir planos padrão
INSERT INTO public.planos (nome, descricao, preco_mensal, preco_anual, limite_anuncios_ativos, recursos) VALUES
('gratuito', 'Plano gratuito - Apenas visualização', 0, 0, 0, ARRAY['Visualizar anúncios', 'Favoritar imóveis']),
('bronze', 'Plano Bronze - Anúncios básicos', 29.90, 299.00, 3, ARRAY['3 anúncios ativos', 'Suporte por email', 'Estatísticas básicas']),
('prata', 'Plano Prata - Anúncios profissionais', 59.90, 599.00, 10, ARRAY['10 anúncios ativos', 'Suporte prioritário', 'Estatísticas avançadas', 'Destaque nos resultados']),
('ouro', 'Plano Ouro - Anúncios premium', 99.90, 999.00, 25, ARRAY['25 anúncios ativos', 'Suporte 24/7', 'Estatísticas completas', 'Destaque premium', 'Relatórios personalizados']);

-- =====================================================
-- 3. TABELA DE ANÚNCIOS
-- =====================================================
CREATE TABLE public.anuncios (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    preco NUMERIC(12,2) NOT NULL,
    endereco TEXT,
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    tipo_imovel VARCHAR(50) DEFAULT 'residencial', -- residencial, comercial, terreno
    tipo_negociacao VARCHAR(20) DEFAULT 'venda', -- venda, aluguel
    quartos INTEGER,
    banheiros INTEGER,
    suites INTEGER,
    vagas_garagem INTEGER,
    area_construida NUMERIC(8,2),
    area_total NUMERIC(8,2),
    mobiliado BOOLEAN DEFAULT FALSE,
    aceita_permuta BOOLEAN DEFAULT FALSE,
    user_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    corretor_id UUID REFERENCES public.usuarios(id), -- se for corretor
    status VARCHAR(20) DEFAULT 'pendente', -- pendente, aprovado, rejeitado, inativo
    motivo_rejeicao TEXT,
    aprovado_em TIMESTAMP WITH TIME ZONE,
    aprovado_por UUID REFERENCES public.usuarios(id),
    visualizacoes INTEGER DEFAULT 0,
    favoritos_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- =====================================================
-- 4. TABELA DE IMAGENS DOS ANÚNCIOS
-- =====================================================
CREATE TABLE public.imagens_anuncios (
    id SERIAL PRIMARY KEY,
    anuncio_id INTEGER NOT NULL REFERENCES public.anuncios(id) ON DELETE CASCADE,
    url_imagem TEXT NOT NULL,
    nome_arquivo VARCHAR(255),
    ordem INTEGER DEFAULT 0,
    is_principal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- =====================================================
-- 5. TABELA DE STORIES
-- =====================================================
CREATE TABLE public.stories (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255),
    descricao TEXT,
    url_imagem TEXT NOT NULL,
    url_video TEXT,
    duracao INTEGER DEFAULT 5, -- duração em segundos
    ordem INTEGER DEFAULT 0,
    ativo BOOLEAN DEFAULT TRUE,
    visualizacoes INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES public.usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '24 hours')
);

-- =====================================================
-- 6. TABELA DE FAVORITOS
-- =====================================================
CREATE TABLE public.favoritos (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    anuncio_id INTEGER NOT NULL REFERENCES public.anuncios(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(user_id, anuncio_id)
);

-- =====================================================
-- 7. TABELA DE SESSÕES ATIVAS (controle de login único)
-- =====================================================
CREATE TABLE public.sessoes_ativas (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    device_info TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '30 days')
);

-- =====================================================
-- 8. TABELA DE ASSINATURAS/HISTÓRICO DE PLANOS
-- =====================================================
CREATE TABLE public.assinaturas (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    plano_id INTEGER NOT NULL REFERENCES public.planos(id),
    status VARCHAR(20) DEFAULT 'ativa', -- ativa, cancelada, expirada
    data_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    data_fim TIMESTAMP WITH TIME ZONE,
    valor_pago NUMERIC(10,2),
    gateway_pagamento VARCHAR(50), -- stripe, paypal, etc
    gateway_id TEXT, -- ID da transação no gateway
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- =====================================================
-- 9. TABELA DE VISUALIZAÇÕES (estatísticas)
-- =====================================================
CREATE TABLE public.visualizacoes_anuncios (
    id SERIAL PRIMARY KEY,
    anuncio_id INTEGER NOT NULL REFERENCES public.anuncios(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.usuarios(id), -- pode ser null se não logado
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- =====================================================
-- 10. FUNÇÕES E TRIGGERS
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para anúncios
CREATE TRIGGER set_anuncios_updated_at
    BEFORE UPDATE ON public.anuncios
    FOR EACH ROW
    EXECUTE PROCEDURE public.set_updated_at();

-- Trigger para usuários
CREATE TRIGGER set_usuarios_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE PROCEDURE public.set_updated_at();

-- Função para verificar limite de anúncios ativos
CREATE OR REPLACE FUNCTION public.verificar_limite_anuncios()
RETURNS TRIGGER AS $$
DECLARE
    limite_plano INTEGER;
    anuncios_ativos INTEGER;
BEGIN
    -- Se for inserção de novo anúncio
    IF TG_OP = 'INSERT' THEN
        SELECT limite_anuncios_ativos INTO limite_plano
        FROM public.usuarios u
        JOIN public.planos p ON u.plano_atual = p.nome
        WHERE u.id = NEW.user_id;
        
        SELECT COUNT(*) INTO anuncios_ativos
        FROM public.anuncios
        WHERE user_id = NEW.user_id AND status = 'aprovado';
        
        IF anuncios_ativos >= limite_plano THEN
            RAISE EXCEPTION 'Limite de anúncios ativos atingido para o plano atual';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar limite de anúncios
CREATE TRIGGER verificar_limite_anuncios_trigger
    BEFORE INSERT ON public.anuncios
    FOR EACH ROW
    EXECUTE PROCEDURE public.verificar_limite_anuncios();

-- Função para atualizar contador de anúncios ativos
CREATE OR REPLACE FUNCTION public.atualizar_contador_anuncios_ativos()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        -- Atualizar contador quando status mudar
        IF OLD.status != NEW.status THEN
            UPDATE public.usuarios 
            SET anuncios_ativos_count = (
                SELECT COUNT(*) 
                FROM public.anuncios 
                WHERE user_id = NEW.user_id AND status = 'aprovado'
            )
            WHERE id = NEW.user_id;
        END IF;
    ELSIF TG_OP = 'INSERT' THEN
        -- Atualizar contador na inserção
        UPDATE public.usuarios 
        SET anuncios_ativos_count = (
            SELECT COUNT(*) 
            FROM public.anuncios 
            WHERE user_id = NEW.user_id AND status = 'aprovado'
        )
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar contador de anúncios ativos
CREATE TRIGGER atualizar_contador_anuncios_trigger
    AFTER INSERT OR UPDATE ON public.anuncios
    FOR EACH ROW
    EXECUTE PROCEDURE public.atualizar_contador_anuncios_ativos();

-- Função para atualizar contador de favoritos
CREATE OR REPLACE FUNCTION public.atualizar_contador_favoritos()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.anuncios 
        SET favoritos_count = favoritos_count + 1
        WHERE id = NEW.anuncio_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.anuncios 
        SET favoritos_count = favoritos_count - 1
        WHERE id = OLD.anuncio_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar contador de favoritos
CREATE TRIGGER atualizar_contador_favoritos_trigger
    AFTER INSERT OR DELETE ON public.favoritos
    FOR EACH ROW
    EXECUTE PROCEDURE public.atualizar_contador_favoritos();

-- =====================================================
-- 11. ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para anúncios
CREATE INDEX idx_anuncios_status ON public.anuncios(status);
CREATE INDEX idx_anuncios_user_id ON public.anuncios(user_id);
CREATE INDEX idx_anuncios_tipo_imovel ON public.anuncios(tipo_imovel);
CREATE INDEX idx_anuncios_tipo_negociacao ON public.anuncios(tipo_negociacao);
CREATE INDEX idx_anuncios_preco ON public.anuncios(preco);
CREATE INDEX idx_anuncios_cidade ON public.anuncios(cidade);
CREATE INDEX idx_anuncios_estado ON public.anuncios(estado);
CREATE INDEX idx_anuncios_created_at ON public.anuncios(created_at);
CREATE INDEX idx_anuncios_aprovado_em ON public.anuncios(aprovado_em);

-- Índices para imagens
CREATE INDEX idx_imagens_anuncio_id ON public.imagens_anuncios(anuncio_id);
CREATE INDEX idx_imagens_ordem ON public.imagens_anuncios(ordem);

-- Índices para stories
CREATE INDEX idx_stories_ativo ON public.stories(ativo, expires_at);
CREATE INDEX idx_stories_created_at ON public.stories(created_at);
CREATE INDEX idx_stories_created_by ON public.stories(created_by);

-- Índices para favoritos
CREATE INDEX idx_favoritos_user_id ON public.favoritos(user_id);
CREATE INDEX idx_favoritos_anuncio_id ON public.favoritos(anuncio_id);

-- Índices para sessões
CREATE INDEX idx_sessoes_user_id ON public.sessoes_ativas(user_id);
CREATE INDEX idx_sessoes_token ON public.sessoes_ativas(session_token);
CREATE INDEX idx_sessoes_expires_at ON public.sessoes_ativas(expires_at);

-- Índices para assinaturas
CREATE INDEX idx_assinaturas_user_id ON public.assinaturas(user_id);
CREATE INDEX idx_assinaturas_status ON public.assinaturas(status);
CREATE INDEX idx_assinaturas_data_fim ON public.assinaturas(data_fim);

-- Índices para visualizações
CREATE INDEX idx_visualizacoes_anuncio_id ON public.visualizacoes_anuncios(anuncio_id);
CREATE INDEX idx_visualizacoes_user_id ON public.visualizacoes_anuncios(user_id);
CREATE INDEX idx_visualizacoes_created_at ON public.visualizacoes_anuncios(created_at);

-- Índices para usuários
CREATE INDEX idx_usuarios_plano_atual ON public.usuarios(plano_atual);
CREATE INDEX idx_usuarios_is_corretor ON public.usuarios(is_corretor);
CREATE INDEX idx_usuarios_creci ON public.usuarios(creci);

-- =====================================================
-- 12. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anuncios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imagens_anuncios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessoes_ativas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visualizacoes_anuncios ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY "Usuários podem ver seus próprios dados"
    ON public.usuarios FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seus próprios dados"
    ON public.usuarios FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seus próprios dados"
    ON public.usuarios FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Políticas para anúncios
CREATE POLICY "Qualquer um pode ver anúncios aprovados"
    ON public.anuncios FOR SELECT
    USING (status = 'aprovado');

CREATE POLICY "Usuários podem ver seus próprios anúncios"
    ON public.anuncios FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar anúncios"
    ON public.anuncios FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus anúncios"
    ON public.anuncios FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins podem aprovar/rejeitar anúncios"
    ON public.anuncios FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND plano_atual = 'admin'
        )
    );

-- Políticas para imagens
CREATE POLICY "Qualquer um pode ver imagens de anúncios aprovados"
    ON public.imagens_anuncios FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.anuncios 
            WHERE id = anuncio_id AND status = 'aprovado'
        )
    );

CREATE POLICY "Usuários podem gerenciar imagens de seus anúncios"
    ON public.imagens_anuncios FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.anuncios 
            WHERE id = anuncio_id AND user_id = auth.uid()
        )
    );

-- Políticas para stories
CREATE POLICY "Qualquer um pode ver stories ativos"
    ON public.stories FOR SELECT
    USING (ativo = true AND expires_at > now());

CREATE POLICY "Apenas admins podem criar stories"
    ON public.stories FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND plano_atual = 'admin'
        )
    );

CREATE POLICY "Apenas admins podem gerenciar stories"
    ON public.stories FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND plano_atual = 'admin'
        )
    );

-- Políticas para favoritos
CREATE POLICY "Usuários podem gerenciar seus favoritos"
    ON public.favoritos FOR ALL
    USING (auth.uid() = user_id);

-- Políticas para sessões
CREATE POLICY "Usuários podem gerenciar suas sessões"
    ON public.sessoes_ativas FOR ALL
    USING (auth.uid() = user_id);

-- Políticas para assinaturas
CREATE POLICY "Usuários podem ver suas assinaturas"
    ON public.assinaturas FOR SELECT
    USING (auth.uid() = user_id);

-- Políticas para visualizações (permitir inserção anônima)
CREATE POLICY "Permitir inserção de visualizações"
    ON public.visualizacoes_anuncios FOR INSERT
    WITH CHECK (true);

-- =====================================================
-- 13. VIEWS ÚTEIS
-- =====================================================

-- View para dashboard admin
CREATE VIEW public.dashboard_admin AS
SELECT 
    (SELECT COUNT(*) FROM public.anuncios WHERE status = 'pendente') as anuncios_pendentes,
    (SELECT COUNT(*) FROM public.anuncios WHERE status = 'aprovado') as anuncios_aprovados,
    (SELECT COUNT(*) FROM public.anuncios WHERE status = 'rejeitado') as anuncios_rejeitados,
    (SELECT COUNT(*) FROM public.usuarios WHERE plano_atual != 'gratuito') as usuarios_pagos,
    (SELECT COUNT(*) FROM public.usuarios WHERE created_at >= now() - interval '30 days') as novos_usuarios_30dias,
    (SELECT COUNT(*) FROM public.anuncios WHERE created_at >= now() - interval '30 days') as novos_anuncios_30dias;

-- View para anúncios pendentes de aprovação
CREATE VIEW public.anuncios_pendentes AS
SELECT 
    a.*,
    u.nome as nome_usuario,
    u.email as email_usuario,
    u.is_corretor,
    u.creci
FROM public.anuncios a
JOIN public.usuarios u ON a.user_id = u.id
WHERE a.status = 'pendente'
ORDER BY a.created_at DESC;

-- View para estatísticas de usuários
CREATE VIEW public.estatisticas_usuarios AS
SELECT 
    plano_atual,
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN created_at >= now() - interval '30 days' THEN 1 END) as novos_30dias,
    AVG(anuncios_ativos_count) as media_anuncios_ativos
FROM public.usuarios
GROUP BY plano_atual;

-- =====================================================
-- 14. COMENTÁRIOS NAS TABELAS E COLUNAS
-- =====================================================

COMMENT ON TABLE public.usuarios IS 'Tabela de usuários do sistema Busca Busca Imóveis';
COMMENT ON COLUMN public.usuarios.is_corretor IS 'Indica se o usuário é corretor de imóveis';
COMMENT ON COLUMN public.usuarios.creci IS 'Número do CRECI do corretor';
COMMENT ON COLUMN public.usuarios.plano_atual IS 'Plano atual do usuário: gratuito, bronze, prata, ouro';

COMMENT ON TABLE public.anuncios IS 'Tabela de anúncios de imóveis';
COMMENT ON COLUMN public.anuncios.status IS 'Status do anúncio: pendente, aprovado, rejeitado, inativo';
COMMENT ON COLUMN public.anuncios.tipo_negociacao IS 'Tipo de negociação: venda, aluguel';

COMMENT ON TABLE public.stories IS 'Tabela de stories do app (apenas admins podem criar)';
COMMENT ON COLUMN public.stories.expires_at IS 'Data de expiração do story (24h por padrão)';

COMMENT ON TABLE public.sessoes_ativas IS 'Controle de sessões ativas para login único';
COMMENT ON COLUMN public.sessoes_ativas.session_token IS 'Token único da sessão';

-- =====================================================
-- FIM DO SCHEMA
-- ===================================================== 