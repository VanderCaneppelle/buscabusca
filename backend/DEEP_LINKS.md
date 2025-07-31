# 🔗 Configuração de Deep Links - Busca Busca Imóveis

## 📋 Resumo das Mudanças

### O que foi alterado:

1. **`authController.js`**: Atualizado para usar deep links nativos diretos em produção
2. **`config/deepLinks.js`**: Novo arquivo para centralizar configuração de deep links
3. **`index.js`**: Adicionado log das configurações na inicialização
4. **`env.example`**: Adicionada variável `NODE_ENV`

### Por que foi alterado:

- **Problema**: Deep links não funcionavam corretamente com app nativo
- **Solução**: Usar `buscabusca://reset-password` diretamente em produção
- **Benefício**: App abrirá diretamente na tela correta quando link for clicado

## 🌍 Configuração por Ambiente

### Desenvolvimento (`NODE_ENV=development`)
```
redirectTo: https://buscabusca-production.up.railway.app/auth/reset-password
```
- Usado para testes com Expo Go
- Redireciona para página HTML intermediária
- Funciona com app em desenvolvimento

### Produção (`NODE_ENV=production`)
```
redirectTo: buscabusca://reset-password
```
- Deep link nativo direto
- Abre app diretamente na tela de reset
- Funciona apenas com app nativo compilado

## 🔧 Como usar

### 1. Configurar ambiente
```bash
# Desenvolvimento
NODE_ENV=development

# Produção  
NODE_ENV=production
```

### 2. Testar recuperação de senha
```bash
# Em desenvolvimento
curl -X POST http://localhost:3000/auth/recuperar-senha \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@exemplo.com"}'

# Em produção
curl -X POST https://buscabusca-production.up.railway.app/auth/recuperar-senha \
  -H "Content-Type: application/json" \
  -d '{"email": "teste@exemplo.com"}'
```

### 3. Verificar logs
O servidor mostrará a configuração de deep links na inicialização:
```
🔗 Configuração de Deep Links:
   NODE_ENV: production
   Reset Password: buscabusca://reset-password
   Email Confirmation: buscabusca://login?email_confirmed=true
   BACKEND_URL: https://buscabusca-production.up.railway.app
```

## 📱 URLs de Deep Link

### Reset de Senha
- **Desenvolvimento**: `https://backend/auth/reset-password`
- **Produção**: `buscabusca://reset-password`

### Confirmação de Email
- **Desenvolvimento**: `https://backend/auth/confirm-email`
- **Produção**: `buscabusca://login?email_confirmed=true`

## 🚀 Próximos Passos

1. **Deploy para produção** com `NODE_ENV=production`
2. **Testar com app nativo** compilado
3. **Verificar deep links** funcionando corretamente
4. **Implementar controle de sessão única** após deploy

## ⚠️ Importante

- Deep links nativos (`buscabusca://`) só funcionam com app compilado
- Em desenvolvimento, continue usando URLs HTTPS para testes
- A mudança é segura e compatível com ambos os ambientes 