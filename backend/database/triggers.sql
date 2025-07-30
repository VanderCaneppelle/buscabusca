-- Trigger para inserir automaticamente dados na tabela usuarios
-- quando um usuário é criado no auth.users

-- Função que será executada pelo trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usuarios (
        id,
        nome,
        email,
        telefone,
        is_corretor,
        creci,
        plano_atual,
        limite_anuncios_ativos,
        anuncios_ativos_count,
        created_at,
        updated_at
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'nome', ''),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'telefone', NULL),
        COALESCE((NEW.raw_user_meta_data->>'is_corretor')::boolean, false),
        COALESCE(NEW.raw_user_meta_data->>'creci', NULL),
        'gratuito',
        0,
        0,
        NOW(),
        NOW()
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que executa a função quando um usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Comentário explicativo
COMMENT ON FUNCTION public.handle_new_user() IS 'Função que insere automaticamente dados na tabela usuarios quando um usuário é criado no auth.users'; 