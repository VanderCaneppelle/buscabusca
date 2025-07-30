import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Switch,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Cadastro: React.FC = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [telefone, setTelefone] = useState('');
    const [isCorretor, setIsCorretor] = useState(false);
    const [creci, setCreci] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [loading, setLoading] = useState(false);

    const { signUp } = useAuth();
    const navigation = useNavigation();

    const validarFormulario = () => {
        if (!nome || !email || !senha || !confirmarSenha) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
            return false;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem');
            return false;
        }

        if (senha.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
            return false;
        }

        if (isCorretor && !creci) {
            Alert.alert('Erro', 'Por favor, informe o número do CRECI');
            return false;
        }

        return true;
    };

    const handleCadastro = async () => {
        if (!validarFormulario()) return;

        try {
            setLoading(true);
            await signUp({
                nome,
                email,
                senha,
                telefone: telefone || undefined,
                is_corretor: isCorretor,
                creci: isCorretor ? creci : undefined,
            });
        } catch (error: any) {
            Alert.alert('Erro no Cadastro', error.message || 'Erro ao fazer cadastro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                    <Ionicons name="person-add" size={80} color="#2563eb" />
                    <Text style={styles.title}>Criar Conta</Text>
                    <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Nome completo *"
                            value={nome}
                            onChangeText={setNome}
                            autoCapitalize="words"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email *"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="call-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Telefone (opcional)"
                            value={telefone}
                            onChangeText={setTelefone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Senha *"
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry={!mostrarSenha}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            onPress={() => setMostrarSenha(!mostrarSenha)}
                            style={styles.eyeIcon}
                        >
                            <Ionicons
                                name={mostrarSenha ? 'eye-outline' : 'eye-off-outline'}
                                size={20}
                                color="#6b7280"
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar senha *"
                            value={confirmarSenha}
                            onChangeText={setConfirmarSenha}
                            secureTextEntry={!mostrarSenha}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.corretorContainer}>
                        <View style={styles.corretorRow}>
                            <Ionicons name="business-outline" size={20} color="#6b7280" />
                            <Text style={styles.corretorText}>Sou corretor de imóveis</Text>
                            <Switch
                                value={isCorretor}
                                onValueChange={setIsCorretor}
                                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                                thumbColor={isCorretor ? '#2563eb' : '#f3f4f6'}
                            />
                        </View>
                    </View>

                    {isCorretor && (
                        <View style={styles.inputContainer}>
                            <Ionicons name="card-outline" size={20} color="#6b7280" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Número do CRECI *"
                                value={creci}
                                onChangeText={setCreci}
                                autoCapitalize="characters"
                            />
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleCadastro}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? 'Criando conta...' : 'Criar Conta'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Já tem uma conta? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                        <Text style={styles.linkText}>Fazer login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginTop: 16,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 8,
        textAlign: 'center',
    },
    form: {
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        marginBottom: 16,
        backgroundColor: '#f9fafb',
    },
    inputIcon: {
        marginLeft: 16,
    },
    input: {
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    eyeIcon: {
        padding: 16,
    },
    corretorContainer: {
        marginBottom: 16,
    },
    corretorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 12,
        backgroundColor: '#f9fafb',
    },
    corretorText: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    button: {
        backgroundColor: '#2563eb',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: '#9ca3af',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    footerText: {
        color: '#6b7280',
        fontSize: 14,
    },
    linkText: {
        color: '#2563eb',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default Cadastro; 