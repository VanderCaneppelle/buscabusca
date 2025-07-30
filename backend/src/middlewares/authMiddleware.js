import jwt from 'jsonwebtoken';

/**
 * Middleware para autenticação JWT
 * Verifica se o token está presente e é válido
 */
export function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token não fornecido. Use: Authorization: Bearer <token>'
        });
    }

    try {
        // Verifica o token JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo_ficticio');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: 'Token inválido ou expirado'
        });
    }
}

/**
 * Middleware opcional para autenticação
 * Não bloqueia a requisição se não houver token
 */
export function optionalAuthMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo_ficticio');
            req.user = decoded;
        } catch (err) {
            // Token inválido, mas não bloqueia a requisição
            console.warn('Token inválido fornecido:', err.message);
        }
    }

    next();
} 