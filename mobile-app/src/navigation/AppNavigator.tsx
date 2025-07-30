import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Telas de autenticação
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import RecuperarSenha from '../screens/RecuperarSenha';
import ResetarSenha from '../screens/ResetarSenha';

// Telas principais
import Home from '../screens/Home';
import AnuncioDetalhes from '../screens/AnuncioDetalhes';
import CriarAnuncio from '../screens/CriarAnuncio';
import Perfil from '../screens/Perfil';
import Favoritos from '../screens/Favoritos';
import Planos from '../screens/Planos';
import Admin from '../screens/Admin';

// Loading screen
import LoadingScreen from '../components/LoadingScreen';

import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Stack de autenticação
const AuthStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="RecuperarSenha" component={RecuperarSenha} />
        <Stack.Screen name="ResetarSenha" component={ResetarSenha} />
    </Stack.Navigator>
);

// Tab Navigator principal
const MainTabNavigator = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap;

                if (route.name === 'Home') {
                    iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Favoritos') {
                    iconName = focused ? 'heart' : 'heart-outline';
                } else if (route.name === 'CriarAnuncio') {
                    iconName = focused ? 'add-circle' : 'add-circle-outline';
                } else if (route.name === 'Perfil') {
                    iconName = focused ? 'person' : 'person-outline';
                } else {
                    iconName = 'help-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2563eb',
            tabBarInactiveTintColor: '#6b7280',
            tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopWidth: 1,
                borderTopColor: '#e5e7eb',
                paddingBottom: 5,
                paddingTop: 5,
                height: 60,
            },
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '500',
            },
        })}
    >
        <Tab.Screen
            name="Home"
            component={Home}
            options={{
                title: 'Início',
                headerShown: false,
            }}
        />
        <Tab.Screen
            name="Favoritos"
            component={Favoritos}
            options={{
                title: 'Favoritos',
                headerShown: false,
            }}
        />
        <Tab.Screen
            name="CriarAnuncio"
            component={CriarAnuncio}
            options={{
                title: 'Anunciar',
                headerShown: false,
            }}
        />
        <Tab.Screen
            name="Perfil"
            component={Perfil}
            options={{
                title: 'Perfil',
                headerShown: false,
            }}
        />
    </Tab.Navigator>
);

// Stack principal
const MainStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen
            name="AnuncioDetalhes"
            component={AnuncioDetalhes}
            options={{
                headerShown: true,
                title: 'Detalhes do Imóvel',
                headerStyle: {
                    backgroundColor: '#2563eb',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        />
        <Stack.Screen
            name="Planos"
            component={Planos}
            options={{
                headerShown: true,
                title: 'Planos',
                headerStyle: {
                    backgroundColor: '#2563eb',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        />
        <Stack.Screen
            name="Admin"
            component={Admin}
            options={{
                headerShown: true,
                title: 'Painel Admin',
                headerStyle: {
                    backgroundColor: '#dc2626',
                },
                headerTintColor: '#ffffff',
                headerTitleStyle: {
                    fontWeight: '600',
                },
            }}
        />
    </Stack.Navigator>
);

// Navegador principal com verificação de autenticação
const AppNavigator = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            {user ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default AppNavigator; 