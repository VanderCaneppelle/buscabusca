import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../api/supabase';

const Perfil: React.FC = () => {
    const { user, signOut } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Buscar dados completos do usuário
    const fetchUserData = async () => {
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (currentUser) {
                const { data, error } = await supabase
                    .from('usuarios')
                    .select('*')
                    .eq('id', currentUser.id)
                    .single();

                if (error) {
                    console.error('Erro ao buscar dados do usuário:', error);
                } else {
                    setUserData(data);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
        } finally {
            setLoading(false);
        }
    };

    // Buscar dados do usuário na tabela usuarios
    useEffect(() => {
        fetchUserData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserData();
        setRefreshing(false);
    };

    const handleSignOut = () => {
        Alert.alert(
            'Sair',
            'Tem certeza que deseja sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Sair', style: 'destructive', onPress: signOut }
            ]
        );
    };

    const getPlanoInfo = (plano: string) => {
        const planos = {
            'gratuito': { nome: 'Gratuito', limite: 0, cor: '#6b7280' },
            'bronze': { nome: 'Bronze', limite: 3, cor: '#cd7f32' },
            'prata': { nome: 'Prata', limite: 10, cor: '#c0c0c0' },
            'ouro': { nome: 'Ouro', limite: 50, cor: '#ffd700' }
        };
        return planos[plano as keyof typeof planos] || planos.gratuito;
    };

    const planoInfo = getPlanoInfo(userData?.plano_atual || 'gratuito');
    const anunciosRestantes = planoInfo.limite - (userData?.anuncios_ativos_count || 0);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Carregando perfil...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Ionicons name="person-circle" size={80} color="#2563eb" />
                </View>
                <Text style={styles.userName}>
                    {userData?.nome || user?.email || 'Usuário'}
                </Text>
                <Text style={styles.userEmail}>{user?.email}</Text>
            </View>

            {/* Informações do Plano */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Seu Plano</Text>

                {planoInfo.nome === 'Gratuito' ? (
                    <View style={[styles.planoCard, { borderLeftColor: planoInfo.cor }]}>
                        <View style={styles.planoHeader}>
                            <Ionicons name="diamond" size={24} color={planoInfo.cor} />
                            <Text style={styles.planoNome}>{planoInfo.nome}</Text>
                        </View>
                        <Text style={styles.planoLimite}>
                            Este plano não permite criar anúncios
                        </Text>
                        <Text style={styles.planoDescricao}>
                            Para anunciar imóveis, você precisa assinar um plano pago
                        </Text>
                        <TouchableOpacity style={styles.upgradeButton}>
                            <Ionicons name="arrow-up-circle" size={20} color="#ffffff" />
                            <Text style={styles.upgradeButtonText}>Ver Planos Disponíveis</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={[styles.planoCard, { borderLeftColor: planoInfo.cor }]}>
                        <View style={styles.planoHeader}>
                            <Ionicons name="diamond" size={24} color={planoInfo.cor} />
                            <Text style={styles.planoNome}>{planoInfo.nome}</Text>
                        </View>
                        <Text style={styles.planoLimite}>
                            Limite: {planoInfo.limite} anúncios ativos
                        </Text>
                        <Text style={styles.anunciosRestantes}>
                            Anúncios restantes: {Math.max(0, anunciosRestantes)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Informações Pessoais */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informações Pessoais</Text>

                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={20} color="#6b7280" />
                    <Text style={styles.infoLabel}>Nome:</Text>
                    <Text style={styles.infoValue}>
                        {userData?.nome || 'Não informado'}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={20} color="#6b7280" />
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{user?.email}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={20} color="#6b7280" />
                    <Text style={styles.infoLabel}>Telefone:</Text>
                    <Text style={styles.infoValue}>
                        {userData?.telefone || 'Não informado'}
                    </Text>
                </View>

                {userData?.is_corretor && (
                    <View style={styles.infoRow}>
                        <Ionicons name="business-outline" size={20} color="#6b7280" />
                        <Text style={styles.infoLabel}>CRECI:</Text>
                        <Text style={styles.infoValue}>
                            {userData?.creci || 'Não informado'}
                        </Text>
                    </View>
                )}
            </View>

            {/* Estatísticas */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Estatísticas</Text>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Ionicons name="home-outline" size={24} color="#2563eb" />
                        <Text style={styles.statNumber}>{userData?.anuncios_ativos_count || 0}</Text>
                        <Text style={styles.statLabel}>Anúncios Ativos</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons name="heart-outline" size={24} color="#dc2626" />
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Favoritos</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons name="eye-outline" size={24} color="#059669" />
                        <Text style={styles.statNumber}>0</Text>
                        <Text style={styles.statLabel}>Visualizações</Text>
                    </View>
                </View>
            </View>

            {/* Ações */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ações</Text>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="settings-outline" size={20} color="#2563eb" />
                    <Text style={styles.actionButtonText}>Editar Perfil</Text>
                    <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="card-outline" size={20} color="#2563eb" />
                    <Text style={styles.actionButtonText}>Gerenciar Plano</Text>
                    <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="help-circle-outline" size={20} color="#2563eb" />
                    <Text style={styles.actionButtonText}>Ajuda e Suporte</Text>
                    <Ionicons name="chevron-forward" size={20} color="#6b7280" />
                </TouchableOpacity>
            </View>

            {/* Botão Sair */}
            <View style={styles.section}>
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Ionicons name="log-out-outline" size={20} color="#ffffff" />
                    <Text style={styles.signOutButtonText}>Sair da Conta</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    loadingText: {
        fontSize: 16,
        color: '#6b7280',
    },
    header: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    avatarContainer: {
        marginBottom: 16,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: '#6b7280',
    },
    section: {
        margin: 20,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 16,
    },
    planoCard: {
        borderLeftWidth: 4,
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
    },
    planoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    planoNome: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginLeft: 8,
    },
    planoLimite: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
    },
    anunciosRestantes: {
        fontSize: 14,
        color: '#059669',
        fontWeight: '500',
    },
    planoDescricao: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 16,
        lineHeight: 20,
    },
    upgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2563eb',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 8,
    },
    upgradeButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    infoLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginLeft: 8,
        marginRight: 8,
        minWidth: 80,
    },
    infoValue: {
        flex: 1,
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        marginHorizontal: 4,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    actionButtonText: {
        flex: 1,
        fontSize: 16,
        color: '#1f2937',
        marginLeft: 12,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dc2626',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 8,
    },
    signOutButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});

export default Perfil; 