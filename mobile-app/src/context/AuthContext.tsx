import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../api/supabase';
import { apiService } from '../api/api';
import { AuthContextType, Usuario, CadastroForm } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<Usuario | null>(null);
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Função para buscar dados do usuário
    const fetchUserData = async (userId: string, userEmail: string) => {
        // Criar usuário básico com dados do Supabase
        setUser({
            id: userId,
            nome: '',
            email: userEmail,
            is_corretor: false,
            plano_atual: 'gratuito',
            limite_anuncios_ativos: 0,
            anuncios_ativos_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        });
    };

    // Função para controlar sessão única (simplificada)
    const controlarSessaoUnica = async (userId: string, sessionToken: string) => {
        // Por enquanto, apenas log - implementar depois
        console.log('Sessão única controlada para usuário:', userId);
    };

    // Função de login
    const signIn = async (email: string, password: string) => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            if (data.session && data.user) {
                setSession(data.session);
                await controlarSessaoUnica(data.user.id, data.session.access_token);
                await fetchUserData(data.user.id, data.user.email || '');
            }
        } catch (error: any) {
            console.error('Erro no login:', error);
            throw new Error(error.message || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    // Função de cadastro
    const signUp = async (data: CadastroForm) => {
        try {
            setLoading(true);

            // Criar usuário no Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: data.email,
                password: data.senha,
                options: {
                    data: {
                        nome: data.nome,
                        telefone: data.telefone,
                        is_corretor: data.is_corretor,
                        creci: data.creci,
                    },
                },
            });

            if (authError) {
                throw authError;
            }

            if (authData.session && authData.user) {
                setSession(authData.session);
                await controlarSessaoUnica(authData.user.id, authData.session.access_token);
                await fetchUserData(authData.user.id, authData.user.email || '');
            }
        } catch (error: any) {
            console.error('Erro no cadastro:', error);
            throw new Error(error.message || 'Erro ao fazer cadastro');
        } finally {
            setLoading(false);
        }
    };

    // Função de logout
    const signOut = async () => {
        try {
            setLoading(true);
            await supabase.auth.signOut();
            setUser(null);
            setSession(null);
        } catch (error) {
            console.error('Erro no logout:', error);
        } finally {
            setLoading(false);
        }
    };

    // Função para atualizar dados do usuário
    const refreshUser = async () => {
        if (session?.user?.id) {
            await fetchUserData(session.user.id);
        }
    };

    // Listener para mudanças na sessão
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session?.user?.id);

                if (session && session.user) {
                    setSession(session);
                    await controlarSessaoUnica(session.user.id, session.access_token);
                    await fetchUserData(session.user.id, session.user.email || '');
                } else {
                    setSession(null);
                    setUser(null);
                }

                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Verificar sessão inicial
    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session: currentSession } } = await supabase.auth.getSession();

                if (currentSession && currentSession.user) {
                    setSession(currentSession);
                    await controlarSessaoUnica(currentSession.user.id, currentSession.access_token);
                    await fetchUserData(currentSession.user.id, currentSession.user.email || '');
                }
            } catch (error) {
                console.error('Erro ao verificar sessão:', error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const value: AuthContextType = {
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 