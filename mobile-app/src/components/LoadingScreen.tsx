import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoadingScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Ionicons name="home" size={80} color="#2563eb" />
            <Text style={styles.title}>Busca Busca Imóveis</Text>
            <ActivityIndicator size="large" color="#2563eb" style={styles.spinner} />
            <Text style={styles.subtitle}>Carregando...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginTop: 16,
        marginBottom: 32,
    },
    spinner: {
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
    },
});

export default LoadingScreen; 