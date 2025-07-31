/**
 * Configuração de Deep Links para o app Busca Busca Imóveis
 * Gerencia URLs de redirecionamento baseado no ambiente
 */

/**
 * Obtém a URL de redirecionamento para reset de senha
 * @returns {string} URL de redirecionamento
 */
export function getResetPasswordRedirectUrl() {
    // Sempre usar o callback do backend para processar o redirecionamento
    return `${process.env.BACKEND_URL || 'https://buscabusca-production.up.railway.app'}/auth/callback`;
}

/**
 * Obtém a URL de redirecionamento para confirmação de email
 * @returns {string} URL de redirecionamento
 */
export function getEmailConfirmationRedirectUrl() {
    // Sempre usar o callback do backend para processar o redirecionamento
    return `${process.env.BACKEND_URL || 'https://buscabusca-production.up.railway.app'}/auth/callback`;
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