/**
 * Configuração de Deep Links para o app Busca Busca Imóveis
 * Gerencia URLs de redirecionamento baseado no ambiente
 */

/**
 * Obtém a URL de redirecionamento para reset de senha
 * @returns {string} URL de redirecionamento
 */
export function getResetPasswordRedirectUrl() {
    if (process.env.NODE_ENV === 'development') {
        // Em desenvolvimento, usar URL do backend para testes com Expo Go
        return `${process.env.BACKEND_URL || 'http://localhost:3000'}/auth/reset-password`;
    } else {
        // Em produção, usar deep link nativo direto
        return 'buscabusca://reset-password';
    }
}

/**
 * Obtém a URL de redirecionamento para confirmação de email
 * @returns {string} URL de redirecionamento
 */
export function getEmailConfirmationRedirectUrl() {
    if (process.env.NODE_ENV === 'development') {
        // Em desenvolvimento, usar URL do backend para testes com Expo Go
        return `${process.env.BACKEND_URL || 'http://localhost:3000'}/auth/confirm-email`;
    } else {
        // Em produção, usar deep link nativo direto
        return 'buscabusca://login?email_confirmed=true';
    }
}

/**
 * Log das configurações de deep link para debug
 */
export function logDeepLinkConfig() {
    console.log('🔗 Configuração de Deep Links:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   Reset Password: ${getResetPasswordRedirectUrl()}`);
    console.log(`   Email Confirmation: ${getEmailConfirmationRedirectUrl()}`);
    console.log(`   BACKEND_URL: ${process.env.BACKEND_URL || 'não definido'}`);
} 