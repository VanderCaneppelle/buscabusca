import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CriarAnuncio: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Criar Anúncio</Text>
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
    text: {
        fontSize: 18,
        color: '#1f2937',
    },
});

export default CriarAnuncio; 