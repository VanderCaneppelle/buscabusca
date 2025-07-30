# 🏠 Busca Busca Imóveis - App Mobile

App mobile React Native com Expo para o sistema de anúncios imobiliários.

## 🚀 Tecnologias Utilizadas

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **Supabase** - Autenticação e banco de dados
- **React Navigation** - Navegação entre telas
- **Axios** - Cliente HTTP para API

## 📱 Funcionalidades

- ✅ **Autenticação** com Supabase
- ✅ **Login e Cadastro** com validação
- ✅ **Controle de sessão única** (logout automático em outros dispositivos)
- ✅ **Navegação** com tabs e stack
- ✅ **Tela Home** com listagem de anúncios
- ✅ **Cadastro de corretores** com CRECI
- ✅ **Interface moderna** e responsiva

## 🏗️ Estrutura do Projeto

```
mobile-app/
├── src/
│   ├── api/
│   │   ├── supabase.ts          # Cliente Supabase
│   │   └── api.ts               # Cliente Axios + funções da API
│   ├── components/
│   │   └── LoadingScreen.tsx    # Tela de carregamento
│   ├── context/
│   │   └── AuthContext.tsx      # Contexto de autenticação
│   ├── navigation/
│   │   └── AppNavigator.tsx     # Navegação principal
│   ├── screens/
│   │   ├── Login.tsx            # Tela de login
│   │   ├── Cadastro.tsx         # Tela de cadastro
│   │   ├── Home.tsx             # Tela principal
│   │   ├── Perfil.tsx           # Perfil do usuário
│   │   └── ...                  # Outras telas
│   └── types/
│       └── index.ts             # Tipos TypeScript
├── App.tsx                      # Componente principal
├── env.example                  # Variáveis de ambiente
└── README.md                    # Esta documentação
```

## 🚀 Como Executar

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar com suas credenciais
```

### 3. Configurar Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Obtenha a URL e chave anônima
3. Configure no arquivo `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_URL=http://localhost:3000
```

### 4. Executar o App

```bash
# Desenvolvimento
npm start

# Android
npm run android

# iOS (apenas macOS)
npm run ios

# Web
npm run web
```

## 📱 Telas Implementadas

### Autenticação
- **Login**: Tela de login com email/senha
- **Cadastro**: Tela de cadastro com validação de corretor

### Principais
- **Home**: Listagem de anúncios com pull-to-refresh
- **Perfil**: Dados do usuário e logout
- **Favoritos**: Lista de favoritos (estrutura básica)
- **Criar Anúncio**: Formulário de criação (estrutura básica)

### Admin
- **Planos**: Visualização de planos (estrutura básica)
- **Admin**: Painel administrativo (estrutura básica)

## 🔐 Autenticação

### Fluxo de Login
1. Usuário insere email/senha
2. Validação no Supabase Auth
3. Controle de sessão única no backend
4. Busca dados do usuário no backend
5. Redirecionamento para Home

### Controle de Sessão Única
- Ao fazer login, outras sessões são invalidadas
- Token armazenado de forma segura com Expo SecureStore
- Logout automático em outros dispositivos

## 📡 Integração com API

### Axios Configurado
- Interceptors para adicionar token automaticamente
- Tratamento de erros 401 (token expirado)
- Base URL configurável via variáveis de ambiente

### Endpoints Disponíveis
- `GET /anuncios/listar` - Listar anúncios
- `POST /anuncios/criar` - Criar anúncio
- `GET /usuarios/perfil` - Dados do usuário
- `POST /favoritos` - Adicionar favorito
- `GET /stories` - Listar stories
- `GET /planos` - Listar planos

## 🎨 Design System

### Cores
- **Primária**: `#2563eb` (Azul)
- **Secundária**: `#6b7280` (Cinza)
- **Sucesso**: `#10b981` (Verde)
- **Erro**: `#dc2626` (Vermelho)

### Componentes
- Inputs com ícones
- Botões com estados de loading
- Cards de anúncios
- Loading screen personalizada

## 📋 Próximos Passos

- [ ] **Upload de imagens** para anúncios
- [ ] **Sistema de busca** avançada
- [ ] **Filtros** por localização e preço
- [ ] **Notificações push**
- [ ] **Pagamentos** integrados
- [ ] **Stories** do app
- [ ] **Chat** entre usuários
- [ ] **Mapa** com localização dos imóveis

## 🐛 Troubleshooting

### Erro de Conexão com Supabase
- Verifique as variáveis de ambiente
- Confirme se o projeto Supabase está ativo

### Erro de API
- Verifique se o backend está rodando
- Confirme a URL da API no `.env`

### Problemas de Navegação
- Verifique se todas as dependências estão instaladas
- Limpe o cache: `npx expo start --clear`

## 📞 Suporte

Para dúvidas sobre o app mobile:
- [Documentação Expo](https://docs.expo.dev/)
- [Documentação React Navigation](https://reactnavigation.org/)
- [Documentação Supabase](https://supabase.com/docs)
- Issues do projeto no GitHub 