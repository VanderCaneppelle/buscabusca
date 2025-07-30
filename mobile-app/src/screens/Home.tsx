import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Dados mockados para demonstração
    const anunciosMock = [
        {
            id: 1,
            titulo: 'Casa com 3 quartos em condomínio fechado',
            cidade: 'São Paulo',
            estado: 'SP',
            preco: 450000,
            quartos: 3,
            banheiros: 2,
            area_construida: 120,
        },
        {
            id: 2,
            titulo: 'Apartamento 2 quartos próximo ao metrô',
            cidade: 'Rio de Janeiro',
            estado: 'RJ',
            preco: 280000,
            quartos: 2,
            banheiros: 1,
            area_construida: 65,
        },
    ];

    const onRefresh = async () => {
        setRefreshing(true);
        // Simular carregamento
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const formatarPreco = (preco: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(preco);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Olá, {user?.nome || 'Usuário'}!</Text>
                    <Text style={styles.subtitle}>Encontre seu imóvel ideal</Text>
                </View>
                <TouchableOpacity style={styles.searchButton}>
                    <Ionicons name="search" size={24} color="#2563eb" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Imóveis em Destaque</Text>

                    {anunciosMock.length > 0 ? (
                        anunciosMock.map((anuncio) => (
                            <TouchableOpacity key={anuncio.id} style={styles.anuncioCard}>
                                <View style={styles.anuncioImage}>
                                    <Ionicons name="home-outline" size={40} color="#9ca3af" />
                                </View>
                                <View style={styles.anuncioInfo}>
                                    <Text style={styles.anuncioTitulo} numberOfLines={2}>
                                        {anuncio.titulo}
                                    </Text>
                                    <Text style={styles.anuncioLocalizacao}>
                                        {anuncio.cidade}, {anuncio.estado}
                                    </Text>
                                    <Text style={styles.anuncioPreco}>
                                        {formatarPreco(anuncio.preco)}
                                    </Text>
                                    <View style={styles.anuncioDetalhes}>
                                        {anuncio.quartos && (
                                            <Text style={styles.detalhe}>
                                                {anuncio.quartos} quartos
                                            </Text>
                                        )}
                                        {anuncio.banheiros && (
                                            <Text style={styles.detalhe}>
                                                {anuncio.banheiros} banheiros
                                            </Text>
                                        )}
                                        {anuncio.area_construida && (
                                            <Text style={styles.detalhe}>
                                                {anuncio.area_construida}m²
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : null}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 2,
    },
    searchButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#eff6ff',
    },
    content: {
        flex: 1,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 16,
    },
    loadingContainer: {
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        fontSize: 16,
        color: '#6b7280',
    },
    anuncioCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    anuncioImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    anuncioInfo: {
        flex: 1,
    },
    anuncioTitulo: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 4,
    },
    anuncioLocalizacao: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
    },
    anuncioPreco: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2563eb',
        marginBottom: 8,
    },
    anuncioDetalhes: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    detalhe: {
        fontSize: 12,
        color: '#6b7280',
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 4,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6b7280',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9ca3af',
        marginTop: 4,
    },
});

export default Home; 