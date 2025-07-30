import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Planos: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Planos</Text>
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

export default Planos; 