import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

console.log('🔍 Debug das variáveis de ambiente:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Configurado' : '❌ Não configurado');
console.log('SUPABASE_KEY:', process.env.SUPABASE_KEY ? '✅ Configurado' : '❌ Não configurado');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Configurado' : '❌ Não configurado');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Mostrar valores (parcialmente)
if (process.env.SUPABASE_URL) {
    console.log('SUPABASE_URL (primeiros 20 chars):', process.env.SUPABASE_URL.substring(0, 20) + '...');
}
if (process.env.SUPABASE_KEY) {
    console.log('SUPABASE_KEY (primeiros 20 chars):', process.env.SUPABASE_KEY.substring(0, 20) + '...');
} 