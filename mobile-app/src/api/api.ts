import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Configuração base do Axios
const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('supabase.auth.token');
            if (token) {
                const parsedToken = JSON.parse(token);
                if (parsedToken.access_token) {
                    config.headers.Authorization = `Bearer ${parsedToken.access_token}`;
                }
            }
        } catch (error) {
            console.error('Erro ao obter token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            // Token expirado ou inválido
            console.log('Token expirado, redirecionando para login...');
            // Aqui você pode implementar refresh token ou logout
        }
        return Promise.reject(error);
    }
);

// Funções da API
export const apiService = {
    // Anúncios
    getAnuncios: (params?: any) => api.get('/anuncios/listar', { params }),
    getAnuncio: (id: number) => api.get(`/anuncios/${id}`),
    criarAnuncio: (data: any) => api.post('/anuncios/criar', data),
    aprovarAnuncio: (id: number) => api.post(`/anuncios/aprovar/${id}`),

    // Usuários
    getPerfil: () => api.get('/usuarios/perfil'),
    atualizarPerfil: (data: any) => api.put('/usuarios/perfil', data),
    criarUsuario: (data: any) => api.post('/usuarios/criar', data),
    controlarSessao: (userId: string, sessionToken: string) =>
        api.post('/usuarios/controlar-sessao', { user_id: userId, session_token: sessionToken }),

    // Favoritos
    getFavoritos: () => api.get('/favoritos'),
    adicionarFavorito: (anuncioId: number) => api.post('/favoritos', { anuncio_id: anuncioId }),
    removerFavorito: (anuncioId: number) => api.delete(`/favoritos/${anuncioId}`),

    // Stories
    getStories: () => api.get('/stories'),

    // Planos
    getPlanos: () => api.get('/planos'),
    assinarPlano: (planoId: number) => api.post('/assinaturas', { plano_id: planoId }),
};

export default api; 