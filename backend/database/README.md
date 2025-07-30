# 🗄️ Banco de Dados - Busca Busca Imóveis

Este diretório contém todos os arquivos relacionados ao banco de dados do projeto.

## 📁 Arquivos

- `schema.sql` - Schema completo do banco de dados
- `README.md` - Esta documentação

## 🏗️ Estrutura do Banco

### Tabelas Principais

| Tabela | Descrição | Relacionamentos |
|--------|-----------|-----------------|
| `usuarios` | Dados dos usuários e planos | Referencia `auth.users` |
| `planos` | Configuração dos planos | - |
| `anuncios` | Anúncios de imóveis | Referencia `usuarios` |
| `imagens_anuncios` | Imagens dos anúncios | Referencia `anuncios` |
| `stories` | Stories do app | Referencia `usuarios` |
| `favoritos` | Favoritos dos usuários | Referencia `usuarios` e `anuncios` |
| `sessoes_ativas` | Controle de login único | Referencia `usuarios` |
| `assinaturas` | Histórico de assinaturas | Referencia `usuarios` e `planos` |
| `visualizacoes_anuncios` | Estatísticas de visualização | Referencia `anuncios` |

## 🚀 Como Executar

### 1. No Supabase Dashboard

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá para **SQL Editor**
4. Cole todo o conteúdo do arquivo `schema.sql`
5. Execute o script

### 2. Via Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Fazer login
supabase login

# Executar migrations
supabase db push
```

## 📊 Planos Disponíveis

| Plano | Preço Mensal | Preço Anual | Anúncios Ativos | Recursos |
|-------|--------------|-------------|-----------------|----------|
| **Gratuito** | R$ 0,00 | R$ 0,00 | 0 | Visualizar anúncios, Favoritar |
| **Bronze** | R$ 29,90 | R$ 299,00 | 3 | Suporte por email, Estatísticas básicas |
| **Prata** | R$ 59,90 | R$ 599,00 | 10 | Suporte prioritário, Estatísticas avançadas |
| **Ouro** | R$ 99,90 | R$ 999,00 | 25 | Suporte 24/7, Relatórios personalizados |

## 🔐 Segurança

### Row Level Security (RLS)

Todas as tabelas principais têm RLS habilitado com políticas específicas:

- **Usuários**: Podem ver/editar apenas seus próprios dados
- **Anúncios**: Públicos quando aprovados, privados quando pendentes
- **Stories**: Apenas admins podem criar/editar
- **Favoritos**: Usuários gerenciam apenas seus favoritos

### Triggers Automáticos

- **Contador de anúncios ativos**: Atualiza automaticamente
- **Contador de favoritos**: Mantém contagem sincronizada
- **Verificação de limites**: Impede criação além do plano
- **Timestamps**: Atualiza `updated_at` automaticamente

## 📈 Views Úteis

### Dashboard Admin
```sql
SELECT * FROM dashboard_admin;
```
Retorna estatísticas gerais do sistema.

### Anúncios Pendentes
```sql
SELECT * FROM anuncios_pendentes;
```
Lista anúncios aguardando aprovação com dados do usuário.

### Estatísticas de Usuários
```sql
SELECT * FROM estatisticas_usuarios;
```
Estatísticas por plano de assinatura.

## 🔍 Índices de Performance

O schema inclui índices otimizados para:

- **Busca por status** de anúncios
- **Filtros por localização** (cidade, estado)
- **Ordenação por data** de criação
- **Busca por usuário** e relacionamentos
- **Controle de sessões** ativas

## 🛠️ Manutenção

### Limpeza de Dados Antigos

```sql
-- Limpar sessões expiradas
DELETE FROM sessoes_ativas WHERE expires_at < NOW();

-- Limpar stories expirados
DELETE FROM stories WHERE expires_at < NOW();

-- Limpar visualizações antigas (opcional)
DELETE FROM visualizacoes_anuncios 
WHERE created_at < NOW() - INTERVAL '1 year';
```

### Backup e Restore

```bash
# Backup
pg_dump -h your-host -U your-user -d your-db > backup.sql

# Restore
psql -h your-host -U your-user -d your-db < backup.sql
```

## 📝 Notas Importantes

1. **CRECI**: Campo obrigatório apenas para corretores
2. **Login Único**: Sistema controla uma sessão ativa por usuário
3. **Aprovação Manual**: Anúncios precisam ser aprovados por admin
4. **Stories**: Expiração automática em 24h
5. **Planos**: Limite automático de anúncios ativos

## 🐛 Troubleshooting

### Erro de Limite de Anúncios
```
ERROR: Limite de anúncios ativos atingido para o plano atual
```
**Solução**: Verificar plano do usuário e quantidade de anúncios aprovados.

### Erro de Permissão
```
ERROR: new row violates row-level security policy
```
**Solução**: Verificar se o usuário tem permissão para a operação.

### Performance Lenta
**Solução**: Verificar se os índices foram criados corretamente.

## 📞 Suporte

Para dúvidas sobre o banco de dados, consulte:
- [Documentação Supabase](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- Issues do projeto no GitHub 