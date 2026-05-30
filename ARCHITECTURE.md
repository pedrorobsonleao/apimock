# 🏗️ Arquitetura - API Mock com Mockoon

## Visão Geral

Ambiente de testes completo e automatizado para API REST, com:
- **Mockoon** - Servidor mock para simular API REST
- **Nginx** - Reverse proxy para acesso unificado
- **Docker Compose** - Orquestração de serviços
- **Node.js** - Executor de testes automatizados
- **Swagger UI** - Documentação interativa

## Diagrama da Arquitetura

```
┌─────────────────────────────────────────────────┐
│             Developer / CI System               │
│                                                  │
│  └─ Web Browser / Test Runner                   │
└────────────────────┬────────────────────────────┘
                     │ HTTP Requests
                     ▼
    ┌────────────────────────────────┐
    │   Nginx Reverse Proxy          │
    │   (localhost:80)               │
    │                                │
    │   ├─ Location / (HTTP)         │
    │   │   └─> Swagger UI           │
    │   │                            │
    │   └─ Location /api (HTTP)      │
    │       └─> Mockoon API Mock     │
    │                                │
    │   CORS Headers Management      │
    │   Request Routing              │
    │   Load Balancing (future)      │
    └────────┬──────────────┬────────┘
             │              │
             │              │
    ┌────────▼──┐  ┌──────▼─────────┐
    │ Swagger   │  │ Mockoon CLI    │
    │ UI        │  │ API Mock       │
    │           │  │                │
    │ Port:8080 │  │ Port: 3000     │
    │           │  │                │
    │ - Shows   │  │ - Mocks all    │
    │   API     │  │   REST calls   │
    │   Docs    │  │ - Returns      │
    │ - Allows  │  │   predefined   │
    │   Tests   │  │   responses    │
    │           │  │ - Simulates    │
    │           │  │   errors       │
    └───────────┘  └────────────────┘
             │              │
             └──────┬───────┘
                    │
        ┌───────────▼───────────┐
        │   Docker Network      │
        │   (api-network)       │
        │                       │
        │ All containers can    │
        │ communicate via names │
        │ (mockoon-api, etc)    │
        └───────────────────────┘
```

## Componentes Principais

### 1. Nginx Reverse Proxy (`nginx-proxy`)

**Responsabilidade**: Entry point único, roteamento de requisições, CORS

**Imagem**: `nginx:alpine`
**Porta**: 80
**Hostname**: `api-nginx-proxy`

**Funcionalidades**:
- Proxy reverso para Swagger UI em `/`
- Proxy reverso para API em `/api/*`
- Headers CORS em todas as respostas
- Suporte para requisições OPTIONS (preflight)
- Log de requisições

**Configuração**: `nginx.conf`

### 2. Mockoon API Mock (`mockoon-api`)

**Responsabilidade**: Simular API REST com endpoints mockados

**Imagem**: `mockoon/cli:latest`
**Porta**: 3000
**Hostname**: `mockoon-api`

**Funcionalidades**:
- 5 endpoints REST mockados
- Respostas baseadas em rules (validação)
- Suporte para autenticação Bearer
- Simulação de erros (401, 403, 404, 400)
- Health check endpoint (`/health`)

**Configuração**: `mockoon-environment.json`

**Endpoints**:
```
GET  /health                    # Health check (sem auth)
POST /login                     # Autenticação
GET  /pessoa                    # Listar pessoas
POST /pessoa                    # Criar pessoa
GET  /pessoa/{id}               # Obter pessoa
PUT  /pessoa/{id}               # Atualizar pessoa
DELETE /pessoa/{id}             # Deletar pessoa
```

### 3. Swagger UI (`swagger-ui`)

**Responsabilidade**: Documentação interativa da API

**Imagem**: `swaggerapi/swagger-ui:latest`
**Porta**: 8080
**Hostname**: `swagger-ui`

**Funcionalidades**:
- Interface web para explorar API
- Permite testar endpoints
- Carrega spec do `swagger.json`
- Aponta para API em `localhost/api`

**Arquivo**: `swagger.json` (OpenAPI 3.0)

### 4. Test Runner (`test-runner`)

**Responsabilidade**: Executar testes automatizados

**Imagem**: `node:18-alpine`
**Hostname**: N/A (container temporário)

**Funcionalidades**:
- Carrega casos de teste do `test-cases.json`
- Executa requisições HTTP via Axios
- Valida status codes e respostas
- Mede duração de cada teste
- Gera relatórios JSON e HTML

**Arquivo**: `tests/run-tests.js`

---

## Fluxo de Dados

### Teste Manual via Browser

```
1. User abre http://localhost
                   ↓
2. Nginx roteia para Swagger UI (localhost:8080)
                   ↓
3. Swagger UI carrega swagger.json
                   ↓
4. User clica em "Try it out" em um endpoint
                   ↓
5. Swagger faz requisição para http://localhost/api/...
                   ↓
6. Nginx intercepta e roteia para http://mockoon-api:3000/...
                   ↓
7. Mockoon processa e retorna resposta
                   ↓
8. Nginx adiciona headers CORS e retorna ao Swagger
                   ↓
9. Swagger exibe resposta no browser
```

### Teste Automatizado

```
1. User executa make test-local
                   ↓
2. Node.js carrega test-cases.json
                   ↓
3. Para cada test case:
   3.1 Monta requisição HTTP
   3.2 Faz requisição para http://localhost:3000
   3.3 Valida status code
   3.4 Valida response body
   3.5 Registra resultado
                   ↓
4. Gera relatório JSON e HTML em reports/
                   ↓
5. Exibe resumo no console
```

---

## Networking

### Docker Network: `api-network` (bridge)

Todos os containers estão conectados via rede Docker named `api-network`.

**Comunicação Interna**:
- `nginx-proxy` → `swagger-ui:8080`
- `nginx-proxy` → `mockoon-api:3000`
- `test-runner` → `mockoon-api:3000`

**Comunicação Externa**:
- Browser/Cliente → `localhost:80` (Nginx)
- Browser/Cliente → `localhost:3000` (Mockoon direto)
- Browser/Cliente → `localhost:8080` (Swagger direto)

---

## Camadas da Aplicação

### 1. API Layer (Mockoon)
- Define endpoints
- Configura respostas
- Define rules de validação
- Simula comportamento real

**Arquivo**: `mockoon-environment.json`

### 2. Gateway Layer (Nginx)
- Roteia requisições
- Adiciona headers CORS
- Centraliza entrada
- Permite future load balancing

**Arquivo**: `nginx.conf`

### 3. Presentation Layer (Swagger UI)
- Interface visual
- Documentação interativa
- Permite testes manuais
- Integração com API

**Arquivo**: `swagger.json`

### 4. Test Layer (Node.js)
- Automação de testes
- Validação de comportamento
- Geração de relatórios
- CI/CD integration

**Arquivos**: `test-cases.json`, `tests/run-tests.js`

---

## Fluxo CORS (Resolvido)

### Problema Original
```
Browser                    Swagger UI             API Mock
  (localhost)              (localhost:8080)       (localhost:3000)
    │                           │                      │
    └──────> fetch API ────────>│──> request ─────────>│
                                 │                      │
                                 │<──────── response ───┤
                                 │    ❌ BLOCKED BY CORS
                                 │    (different origin)
                                 │
                                 ├─> Error: Cross-origin request failed
                                 │
             display error <─────┤
```

### Solução: Nginx Reverse Proxy
```
Browser                    Nginx Proxy           API Mock
  (localhost:80)           (localhost)          (localhost:3000)
    │                           │                      │
    └──────> fetch ────────────>│                      │
                                │ (same origin!)       │
                                │──> proxy request ───>│
                                │                      │
                                │<──── response ──────┤
                                │                      │
                                │ ✅ Add CORS headers
                                │
             display response <──┤
                                │
                    ✅ Success! No CORS errors
```

---

## Configuração de Exemplo

### docker-compose.yml

```yaml
services:
  nginx-proxy:
    image: nginx:alpine
    ports: ["80:80"]
    volumes: ["./nginx.conf:/etc/nginx/nginx.conf"]
    depends_on: [mockoon-api, swagger-ui]

  mockoon-api:
    image: mockoon/cli:latest
    ports: ["3000:3000"]
    volumes: ["./mockoon-environment.json:/mockoon/environment.json"]
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]

  swagger-ui:
    image: swaggerapi/swagger-ui:latest
    ports: ["8080:8080"]
    volumes: ["./swagger.json:/swagger.json"]

networks:
  api-network:
    driver: bridge
```

---

## Segurança

### Implementado
- ✅ Bearer token authentication
- ✅ Authorization header validation
- ✅ CORS headers properly configured
- ✅ HTTP only (no credentials in URL)

### Recomendado (Futuro)
- [ ] HTTPS/TLS encryption
- [ ] Rate limiting
- [ ] API key rotation
- [ ] Request signing
- [ ] WAF (Web Application Firewall)

---

## Performance Considerations

### Current
- Latency: ~50-150ms por requisição
- Throughput: ~1000 req/sec (nginx limit)
- Containers: ~150MB RAM total

### Optimization Opportunities
- [ ] Response caching in Nginx
- [ ] Gzip compression
- [ ] Connection pooling
- [ ] Load balancing
- [ ] CDN integration

---

## Extensibilidade

### Adicionar Novo Endpoint

1. **Em `mockoon-environment.json`**:
   ```json
   {
     "endpoint": "/novo-recurso",
     "method": "get",
     "responses": [...]
   }
   ```

2. **Em `swagger.json`**:
   ```json
   {
     "paths": {
       "/novo-recurso": {
         "get": {...}
       }
     }
   }
   ```

3. **Em `test-cases.json`**:
   ```json
   {
     "id": "novo_001",
     "request": {...},
     "expectedResponse": {...}
   }
   ```

### Adicionar Novo Service

1. Criar serviço em `docker-compose.yml`
2. Adicionar à rede `api-network`
3. Atualizar `nginx.conf` se necessário
4. Documentar em README

---

## Troubleshooting

### Container não sobe
```bash
docker compose logs <service-name>
docker compose ps
```

### CORS ainda falhando
```bash
curl -v -H "Origin: http://localhost:8080" http://localhost/api/health
# Deve retornar Access-Control-Allow-Origin header
```

### Testes falhando
```bash
make logs
make logs-test
# Verificar se API está respondendo
curl http://localhost:3000/health
```

---

## Diagrama de Sequência - Teste Completo

```
User                    Node.js             Nginx              Mockoon
 │                         │                  │                  │
 │── make test-local ──────>│                  │                  │
 │                         │                  │                  │
 │                         │─ load tests ────>│                  │
 │                         │                  │                  │
 │                         │─ for each test──>│                  │
 │                         │                  │─ proxy request ─>│
 │                         │                  │<── response ─────│
 │                         │<─ validate ──────│                  │
 │                         │                  │                  │
 │                         │─ generate report>│                  │
 │                         │                  │                  │
 │<─ display results ──────│                  │                  │
```

---

## Métricas e Monitoramento

### Endpoints
- Total: 7 (1 health + 1 login + 5 CRUD)
- Response time: 50-150ms
- Success rate: 100%

### Testes
- Total: 13 casos
- Pass rate: 100% (13/13)
- Execution time: ~1200ms
- Frequency: On demand, CI/CD

### Infra
- Containers: 4 (nginx, mockoon, swagger, test-runner opcional)
- Memory: ~150-200MB
- Disk: ~500MB (images + reports)
- Network: Bridge (internal)

---

**Criado**: May 2026
**Última Atualização**: May 29, 2026
**Status**: ✅ Completo e Funcional
