// Tipos de usuário
export interface Usuario {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    is_corretor: boolean;
    creci?: string;
    plano_atual: 'gratuito' | 'bronze' | 'prata' | 'ouro';
    data_assinatura?: string;
    data_expiracao?: string;
    limite_anuncios_ativos: number;
    anuncios_ativos_count: number;
    created_at: string;
    updated_at: string;
}

// Tipos de anúncio
export interface Anuncio {
    id: number;
    titulo: string;
    descricao: string;
    preco: number;
    endereco?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    latitude?: number;
    longitude?: number;
    tipo_imovel: 'residencial' | 'comercial' | 'terreno';
    tipo_negociacao: 'venda' | 'aluguel';
    quartos?: number;
    banheiros?: number;
    suites?: number;
    vagas_garagem?: number;
    area_construida?: number;
    area_total?: number;
    mobiliado: boolean;
    aceita_permuta: boolean;
    user_id: string;
    corretor_id?: string;
    status: 'pendente' | 'aprovado' | 'rejeitado' | 'inativo';
    motivo_rejeicao?: string;
    aprovado_em?: string;
    aprovado_por?: string;
    visualizacoes: number;
    favoritos_count: number;
    created_at: string;
    updated_at: string;
    imagens?: ImagemAnuncio[];
    usuario?: Usuario;
}

// Tipos de imagem
export interface ImagemAnuncio {
    id: number;
    anuncio_id: number;
    url_imagem: string;
    nome_arquivo?: string;
    ordem: number;
    is_principal: boolean;
    created_at: string;
}

// Tipos de story
export interface Story {
    id: number;
    titulo?: string;
    descricao?: string;
    url_imagem: string;
    url_video?: string;
    duracao: number;
    ordem: number;
    ativo: boolean;
    visualizacoes: number;
    created_by: string;
    created_at: string;
    expires_at: string;
}

// Tipos de plano
export interface Plano {
    id: number;
    nome: string;
    descricao?: string;
    preco_mensal?: number;
    preco_anual?: number;
    limite_anuncios_ativos: number;
    recursos: string[];
    ativo: boolean;
    created_at: string;
}

// Tipos de favorito
export interface Favorito {
    id: number;
    user_id: string;
    anuncio_id: number;
    created_at: string;
    anuncio?: Anuncio;
}

// Tipos de navegação
export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
    Login: undefined;
    Cadastro: undefined;
    RecuperarSenha: undefined;
    ResetarSenha: undefined;
    Home: undefined;
    AnuncioDetalhes: { id: number };
    CriarAnuncio: undefined;
    Perfil: undefined;
    Favoritos: undefined;
    Planos: undefined;
    Admin: undefined;
};

// Tipos de formulários
export interface LoginForm {
    email: string;
    senha: string;
}

export interface CadastroForm {
    nome: string;
    email: string;
    senha: string;
    telefone?: string;
    is_corretor: boolean;
    creci?: string;
}

export interface CriarAnuncioForm {
    titulo: string;
    descricao: string;
    preco: number;
    endereco?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    tipo_imovel: 'residencial' | 'comercial' | 'terreno';
    tipo_negociacao: 'venda' | 'aluguel';
    quartos?: number;
    banheiros?: number;
    suites?: number;
    vagas_garagem?: number;
    area_construida?: number;
    area_total?: number;
    mobiliado: boolean;
    aceita_permuta: boolean;
}

// Tipos de contexto
export interface AuthContextType {
    user: Usuario | null;
    session: any;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (data: CadastroForm) => Promise<void>;
    signOut: () => Promise<void>;
    refreshUser: () => Promise<void>;
} 