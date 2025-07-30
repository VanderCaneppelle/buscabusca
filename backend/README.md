# 🏠 BuscaBusca Backend

Backend para aplicação de anúncios imobiliários desenvolvido com Node.js, Express e Supabase.

## 📋 Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/
│   │   └── anuncioController.js    # Lógica de negócio dos anúncios
│   ├── routes/
│   │   └── anuncioRoutes.js        # Definição das rotas
│   ├── middlewares/
│   │   └── authMiddleware.js       # Autenticação JWT
│   ├── supabase/
│   │   └── supabaseClient.js       # Cliente do Supabase
│   └── index.js                    # Servidor Express
├── package.json
├── env.example                     # Exemplo de variáveis de ambiente
└── README.md
```

## 🚀 Instalação

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente:**
   ```bash
   # Copiar o arquivo de exemplo
   cp env.example .env
   
   # Editar o arquivo .env com suas credenciais
   ```

3. **Configurar o Supabase:**
   - Crie um projeto no [Supabase](https://supabase.com)
   - Obtenha a URL e chave da API
   - Configure no arquivo `.env`

## ⚙️ Configuração do Banco de Dados

Crie a tabela `anuncios` no Supabase com a seguinte estrutura:

```sql
CREATE TABLE anuncios (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL,
  endereco TEXT,
  tipo_imovel VARCHAR(50) DEFAULT 'residencial',
  quartos INTEGER,
  banheiros INTEGER,
  area DECIMAL(8,2),
  user_id UUID NOT NULL,
  aprovado BOOLEAN DEFAULT FALSE,
  aprovado_em TIMESTAMP,
  aprovado_por UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🏃‍♂️ Executando o Projeto

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Produção
npm start
```

O servidor estará disponível em: `http://localhost:3000`

## 📡 Endpoints da API

### Anúncios

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/anuncios/listar` | Listar anúncios aprovados | ❌ |
| GET | `/anuncios/:id` | Buscar anúncio por ID | ❌ |
| POST | `/anuncios/criar` | Criar novo anúncio | ✅ |
| POST | `/anuncios/aprovar/:id` | Aprovar anúncio | ✅ |

### Parâmetros de Query (Listar Anúncios)

- `page`: Número da página (padrão: 1)
- `limit`: Itens por página (padrão: 10)
- `tipo_imovel`: Filtrar por tipo (residencial, comercial, etc.)
- `preco_min`: Preço mínimo
- `preco_max`: Preço máximo

### Exemplo de Uso

```bash
# Listar anúncios
curl http://localhost:3000/anuncios/listar

# Criar anúncio (requer token JWT)
curl -X POST http://localhost:3000/anuncios/criar \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "titulo": "Casa 3 quartos",
    "descricao": "Linda casa com 3 quartos e 2 banheiros",
    "preco": 250000,
    "endereco": "Rua das Flores, 123",
    "quartos": 3,
    "banheiros": 2,
    "area": 120.5
  }'
```

## 🔐 Autenticação

O sistema usa JWT para autenticação. Para rotas protegidas, inclua o header:

```
Authorization: Bearer SEU_TOKEN_JWT
```

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Supabase** - Banco de dados e autenticação
- **JWT** - Autenticação
- **dotenv** - Variáveis de ambiente

## 📝 Próximos Passos

- [ ] Integração com Supabase Auth
- [ ] Upload de imagens
- [ ] Sistema de busca avançada
- [ ] Notificações
- [ ] Documentação com Swagger
- [ ] Testes automatizados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. 