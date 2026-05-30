# 🎯 API Mock com Mockoon - Testes Automatizados

Ambiente completo de testes para API REST baseado em OpenAPI 3.0, utilizando **Mockoon** como servidor mock, **Docker Compose** para orquestração e **Nginx** como reverse proxy para acesso unificado sem problemas de CORS.

## ✨ Destaques

- ✅ **Mockoon Environment** - Configuração de endpoints mockados com CORS habilitado
- ✅ **Test Cases** - 13 casos de teste (3 auth + 10 CRUD) com **100% de sucesso**
- ✅ **Automated Tests** - Script Node.js + Axios com testes automatizados
- ✅ **Docker Compose** - Orquestração completa (Mockoon, Nginx, Swagger, Testes)
- ✅ **Nginx Reverse Proxy** - Entry point único, sem erros de CORS
- ✅ **Relatórios** - JSON e HTML gerados automaticamente
- ✅ **Makefile** - Comandos facilitados para operações comuns

## 🚀 Quick Start

### Pré-requisitos
- Docker & Docker Compose v2
- (Opcional) Node.js 18+ para testes locais

### 1. Iniciar Ambiente

```bash
make up
# ou
docker compose up -d
```

### 2. Acessar Serviços

- **Swagger UI**: http://localhost ✨ (sem erros de CORS)
- **API Mock via Proxy**: http://localhost/api
- **API Direto (dev)**: http://localhost:3000
- **Swagger Direto (dev)**: http://localhost:8080

### 3. Executar Testes

```bash
make test-local
npm test
```

### 4. Visualizar Relatórios

```bash
open reports/test-report-*.html
```

## 📊 Status: 100% ✅

```
Total:    13 testes
Passou:   13 (100%)
Falhou:   0
Tempo:    ~1200ms
```

### Testes

**Autenticação (3/3)** - Login com credenciais válidas, inválidas, usuário vazio
**CRUD Pessoas (10/10)** - Listar, criar, obter, atualizar, deletar com sucesso e erros

## 📁 Arquitetura

```
Browser (localhost)
    ↓
Nginx (port 80)
    ├─ / → Swagger UI
    └─ /api/* → API Mock (localhost:3000)
```

## 🔧 Comandos

```bash
# Gerenciamento
make up              # Inicia containers
make down            # Para containers
make status          # Verifica status

# Testes
make test-local      # Testes localmente
make test            # Testes no Docker

# Logs
make logs            # Logs da API
make logs-nginx      # Logs do Nginx
```

## 🔐 Endpoints

```bash
POST /login
GET /pessoa
POST /pessoa
GET /pessoa/{id}
PUT /pessoa/{id}
DELETE /pessoa/{id}
```

## 🛠️ Desenvolvimento

### Adicionar Teste
1. Editar `test-cases.json`
2. Executar `make test-local`

### Modificar Mock
1. Editar `mockoon-environment.json`
2. Executar `docker compose restart mockoon-api`

## 🐛 Troubleshooting

### Testes falhando
```bash
make logs
make logs-test
```

### Remover tudo e recomeçar
```bash
make clean
make up
make test-local
```

## ✨ CORS Resolvido

**Problema**: Swagger UI em localhost:8080 não conseguia acessar API em localhost:3000

**Solução**: Nginx reverse proxy centraliza tudo em localhost:80

**Resultado**: Zero erros de CORS! 🎉

## 📚 Documentação

- [Mockoon Documentation](https://mockoon.com/docs/)
- [OpenAPI 3.0 Spec](https://spec.openapis.org/oas/v3.0.3)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Criado como especialista em testes** ✨  
*Automatizando qualidade, garantindo confiabilidade com CORS resolvido* 🎉
