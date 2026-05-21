# 🎯 API Mock com Mockoon - Testes Automatizados

Ambiente completo de testes para API REST baseado em OpenAPI 3.0, utilizando Mockoon como servidor mock e Docker Compose para orquestração.

## 📋 Conteúdo

- ✅ **Mockoon Environment** - Configuração de endpoints mockados
- ✅ **Test Cases** - Massa de testes completa com 13 casos
- ✅ **Automated Tests** - Script Node.js com testes automatizados
- ✅ **Docker Compose** - Orquestração de serviços (Mockoon, Testes, Swagger)
- ✅ **Makefile** - Comandos facilitados
- ✅ **HTML Reports** - Relatórios visuais dos testes

## 🚀 Quick Start

### Pré-requisitos
- Docker & Docker Compose
- (Opcional) Node.js 18+ para testes locais

### 1. Iniciar Ambiente

```bash
make up
# ou
docker-compose up -d
```

### 2. Executar Testes

```bash
# Testes no Docker (recomendado)
make test

# Testes localmente (se Node.js instalado)
make test-local
```

### 3. Acessar Serviços

- **API Mock**: http://localhost:3000
- **Swagger UI**: http://localhost:8080
- **Relatórios**: `./reports/` (após executar testes)

## 📁 Estrutura de Arquivos

```
apimock/
├── swagger.json                  # Especificação OpenAPI original
├── mockoon-environment.json      # Configuração Mockoon com 5 endpoints
├── test-cases.json              # 13 casos de teste (3 auth + 10 CRUD)
├── docker-compose.yml           # Orquestração Docker
├── Makefile                      # Comandos facilitados
├── README.md                     # Este arquivo
├── tests/
│   └── run-tests.js            # Script de testes automatizados
└── reports/                     # Relatórios gerados (JSON + HTML)
```

## 🔧 Endpoints Mockados

### 1. Autenticação

```bash
POST /login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

✓ Sucesso (200): Retorna JWT token
✗ Falha (401): Credenciais inválidas
```

### 2. Pessoas (CRUD)

#### Listar Pessoas
```bash
GET /pessoa
Authorization: Bearer <token>

✓ Sucesso (200): Array com 5 pessoas
✗ Falha (403): Sem autenticação
✗ Falha (500): Erro do servidor
```

#### Criar Pessoa
```bash
POST /pessoa
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "João Silva"
}

✓ Sucesso (200): Retorna pessoa criada
✗ Falha (400): Nome inválido (< 3 ou > 255 caracteres)
```

#### Obter Pessoa
```bash
GET /pessoa/{id}
Authorization: Bearer <token>

✓ Sucesso (200): Retorna pessoa
✗ Falha (404): Pessoa não encontrada
```

#### Atualizar Pessoa
```bash
PUT /pessoa/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "Novo Nome"
}

✓ Sucesso (200): Retorna pessoa atualizada
✗ Falha (404): Pessoa não encontrada
```

#### Deletar Pessoa
```bash
DELETE /pessoa/{id}
Authorization: Bearer <token>

✓ Sucesso (200): Pessoa deletada
✗ Falha (404): Pessoa não encontrada
```

## 📊 Casos de Teste

### Autenticação (3 casos)
1. ✅ `login_001` - Login com credenciais válidas
2. ✅ `login_002` - Login com credenciais inválidas
3. ✅ `login_003` - Login com usuário vazio

### Pessoas - CRUD (10 casos)
4. ✅ `pessoa_001` - Listar pessoas com sucesso
5. ✅ `pessoa_002` - Listar sem autenticação
6. ✅ `pessoa_003` - Criar pessoa válida
7. ✅ `pessoa_004` - Criar pessoa com nome inválido
8. ✅ `pessoa_005` - Obter pessoa por ID
9. ✅ `pessoa_006` - Obter pessoa inexistente
10. ✅ `pessoa_007` - Atualizar pessoa
11. ✅ `pessoa_008` - Atualizar pessoa inexistente
12. ✅ `pessoa_009` - Deletar pessoa
13. ✅ `pessoa_010` - Deletar pessoa inexistente

## 📊 Status dos Testes

**Taxa de Sucesso**: ✅ **13/13 (100%)**

### Autenticação (3/3 ✅)
- ✅ Login com credenciais válidas
- ✅ Login com credenciais inválidas  
- ✅ Login com usuário vazio

### CRUD Pessoas (10/10 ✅)
- ✅ Listar pessoas com sucesso
- ✅ Listar sem autenticação
- ✅ Criar pessoa válida
- ✅ Criar pessoa com nome inválido
- ✅ Obter pessoa por ID
- ✅ Obter pessoa inexistente
- ✅ Atualizar pessoa
- ✅ Atualizar pessoa inexistente
- ✅ Deletar pessoa
- ✅ Deletar pessoa inexistente

### Gerenciamento de Containers

```bash
make up              # Inicia containers
make down            # Para containers
make start           # Inicia (se parados)
make stop            # Para (sem remover)
make rebuild         # Reconstrói (clean + build + up)
make clean           # Remove containers e volumes
make status          # Status dos serviços
```

### Testes

```bash
make test            # Executa testes no Docker
make test-local      # Executa testes localmente (requer Node.js)
make curl-test       # Testa endpoints com curl
make health          # Verifica saúde da API
```

### Logs

```bash
make logs            # Logs da API Mockoon
make logs-test       # Logs dos testes
make logs-swagger    # Logs do Swagger UI
```

### Utilidades

```bash
make info            # Informações do projeto
make version         # Versão de ferramentas
make view-reports    # Abre relatório HTML
make shell           # Shell no container Mockoon
make help            # Mostra todos os comandos
```

## 📈 Relatórios de Teste

Após executar `make test`, dois relatórios são gerados em `./reports/`:

### 1. JSON Report
```json
{
  "total": 13,
  "passed": 13,
  "failed": 0,
  "tests": [
    {
      "id": "login_001",
      "name": "Login com credenciais válidas",
      "passed": true,
      "duration": 45,
      "statusCode": 200
    },
    ...
  ]
}
```

### 2. HTML Report
Relatório visual com:
- 📊 Cards de resumo (Total, Passou, Falhou, Taxa)
- 📋 Tabela de testes com detalhes
- 🎨 Design responsivo e profissional
- 📱 Compatível com dispositivos móveis

## 🔍 Validações Implementadas

### Status HTTP
- ✅ Valida status esperado vs. recebido
- ✅ Suporta múltiplas respostas por endpoint

### Response Body
- ✅ Valida campos esperados
- ✅ Valida tipos de dados (array, object)
- ✅ Valida comprimento mínimo/máximo

### Performance
- ⏱️ Mede duração de cada teste
- ⏱️ Timeout configurável por teste
- ⏱️ Simulação de latência realista

### Segurança
- 🔐 Suporta Bearer Token (JWT)
- 🔐 Validação de autenticação
- 🔐 Headers customizados

## 🐳 Docker Compose Services

### 1. mockoon-api
- **Image**: mockoon/cli:latest
- **Port**: 3000:3000
- **Volume**: mockoon-environment.json
- **Health Check**: GET /pessoa

### 2. test-runner
- **Image**: node:18-alpine
- **Depends On**: mockoon-api (healthy)
- **Executa**: tests/run-tests.js
- **Output**: /app/reports/

### 3. swagger-ui
- **Image**: swaggerapi/swagger-ui:latest
- **Port**: 8080:8080
- **Volume**: swagger.json

## 📝 Uso de Desenvolvimento

### Adicionar Novo Caso de Teste

1. Editar `test-cases.json`:
```json
{
  "id": "pessoa_011",
  "name": "Novo teste",
  "request": {
    "method": "GET",
    "url": "http://localhost:3000/pessoa/1",
    "headers": {
      "Authorization": "Bearer token"
    }
  },
  "expectedResponse": {
    "statusCode": 200,
    "body": { "id": 1, "nome": "João Silva" }
  },
  "timeout": 5000
}
```

2. Reiniciar containers:
```bash
make restart
make test
```

### Modificar Mock Responses

1. Editar `mockoon-environment.json`
2. Reiniciar Mockoon:
```bash
docker-compose restart mockoon-api
```

### Executar Teste Específico

Editar `tests/run-tests.js` para filtrar por ID:
```javascript
const testCases = this.testCases.pessoaTestCases
  .filter(t => t.id === 'pessoa_001');
```

## 🎓 Best Practices

### ✅ Para Testes

1. **Organização**: Agrupar testes por funcionalidade (auth, CRUD)
2. **Naming**: Nomes descritivos e auto-explicativos
3. **Isolamento**: Cada teste deve ser independente
4. **Cenários**: Incluir sucesso e erro
5. **Dados**: Usar dados realistas

### ✅ Para Mocks

1. **Realismo**: Respostas que simulam produção
2. **Latência**: Incluir delays realistas
3. **Erros**: Cobrir todos os cenários de erro
4. **Validação**: Validar entrada quando possível
5. **Documentação**: Documentar cada endpoint

### ✅ Para CI/CD

```bash
# Pipeline básico
docker-compose up -d mockoon-api
sleep 10
make test

# Verificar resultado
echo $?  # 0 = todos passaram, 1 = algum falhou
```

## 🐛 Troubleshooting

### API não responde
```bash
make health
# ou
curl -v http://localhost:3000/pessoa
```

### Testes falhando
```bash
make logs
make logs-test
```

### Remover tudo e recomeçar
```bash
make clean
make up
make test
```

### Ports em uso
```bash
# Mudar ports no docker-compose.yml
# Ou liberar a port:
sudo lsof -i :3000
sudo kill -9 <PID>
```

## 📚 Referências

- [Mockoon CLI Documentation](https://mockoon.com/docs/latest/admin-api/cli-main/)
- [OpenAPI 3.0 Spec](https://spec.openapis.org/oas/v3.0.3)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)

## 💡 Próximas Melhorias

- [ ] CI/CD Integration (GitHub Actions)
- [ ] Performance Testing (Apache JMeter)
- [ ] Contract Testing (Pact)
- [ ] Load Testing
- [ ] API Documentation Auto-generation
- [ ] Postman Collection Export

## 📞 Suporte

Para problemas ou sugestões:

1. Verificar logs: `make logs`
2. Consultar relatórios: `./reports/`
3. Testar manualmente: `make curl-test`

---

**Criado como especialista em testes** ✨  
*Automatizando qualidade, garantindo confiabilidade*
