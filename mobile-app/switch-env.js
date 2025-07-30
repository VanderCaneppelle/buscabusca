const fs = require('fs');
const path = require('path');

const environments = {
    local: {
        name: 'Local Development',
        apiUrl: 'http://localhost:3000'
    },
    railway: {
        name: 'Railway (Testes)',
        apiUrl: 'https://buscabusca-production.up.railway.app'
    }
};

function switchEnvironment(env) {
    if (!environments[env]) {
        console.log('❌ Ambiente inválido!');
        console.log('Ambientes disponíveis:', Object.keys(environments).join(', '));
        return;
    }

    const envContent = `# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=https://tihrertrwfkmeacxweef.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpaHJlcnRyd2ZrbWVhY3h3ZWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4ODcxNTIsImV4cCI6MjA2OTQ2MzE1Mn0.V3ElOQYkxKxTJCrqX-CFXo2-S7QQdPBbm_O-Pb57eR0

# Backend API Configuration - ${environments[env].name.toUpperCase()}
EXPO_PUBLIC_API_URL=${environments[env].apiUrl}
`;

    fs.writeFileSync('.env', envContent);
    console.log(`✅ Ambiente alterado para: ${environments[env].name}`);
    console.log(`🌐 API URL: ${environments[env].apiUrl}`);
    console.log('🔄 Reinicie o Expo para aplicar as mudanças: npx expo start --clear');
}

// Verificar argumento da linha de comando
const targetEnv = process.argv[2];
if (targetEnv) {
    switchEnvironment(targetEnv);
} else {
    console.log('🔧 Switch Environment - Busca Busca Imóveis');
    console.log('');
    console.log('Uso: node switch-env.js <ambiente>');
    console.log('');
    console.log('Ambientes disponíveis:');
    Object.entries(environments).forEach(([key, env]) => {
        console.log(`  ${key}: ${env.name} (${env.apiUrl})`);
    });
    console.log('');
    console.log('Exemplos:');
    console.log('  node switch-env.js local    # Para desenvolvimento local');
    console.log('  node switch-env.js railway  # Para testes no Railway');
} 