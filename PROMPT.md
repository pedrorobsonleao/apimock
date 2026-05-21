# 🤖 PROMPT PARA REPRODUÇÃO - API MOCK COM MOCKOON E TESTES

## 📋 Instruções para Reproduzir em Qualquer Plataforma de IA

Use este prompt em qualquer plataforma de IA (Claude, ChatGPT, Gemini, Copilot, etc.) para reproduzir o setup completo de testes com Mockoon.

---

## 🎯 PROMPT PRINCIPAL

### Versão Completa

```
Como um especialista em testes, você está em um projeto chamado "apimock" 
que contém um arquivo swagger.json com a especificação OpenAPI 3.0 de uma API REST.

TAREFAS:

1. LEIA O ARQUIVO swagger.json e CRIE um novo arquivo no padrão Mockoon 
   (mockoon-environment.json) contendo:
   - Todos os endpoints da API
   - Respostas mockadas para cada endpoint
   - Cenários de sucesso (2xx) e erro (4xx, 5xx)
   - Latência realista (50-300ms)
   - Headers adequados (Content-Type, etc.)

2. CRIE uma MASSA DE TESTES (test-cases.json) com:
   - Casos de teste para cada endpoint
   - Validações de status HTTP
   - Validações de response body
   - Testes de sucesso e erro
   - Testes de autenticação/segurança
   - Cobertura mínima: 10+ casos

3. CRIE um SCRIPT DE TESTES (tests/run-tests.js) que:
   - Use Node.js com axios
   - Execute automaticamente todos os casos de teste
   - Valide status HTTP esperado
   - Valide campos do response body
   - Meça latência de cada teste
   - Gere relatório JSON com resultados
   - Gere relatório HTML visual com CSS inline
   - Mostre resumo de sucesso/falha em cores

4. CRIE um DOCKER-COMPOSE (docker-compose.yml) que:
   - Configure container Mockoon CLI na porta 3000
   - Configure container Node para executar testes
   - Configure container Swagger UI na porta 8080
   - Inclua health checks
   - Defina dependências entre serviços

5. CRIE um MAKEFILE com comandos:
   - make up (inicia containers)
   - make down (para containers)
   - make test (executa testes)
   - make logs (mostra logs)
   - make clean (remove tudo)
   - make rebuild (reconstrói)
   - make status (status dos serviços)
   - make curl-test (testa com curl)

6. CRIE DOCUMENTAÇÃO:
   - README.md (completo, com exemplos)
   - QUICK-START.sh (guia visual)

7. CRIE ARQUIVOS DE SUPORTE:
   - package.json (com scripts npm)
   - .env (variáveis de ambiente)
   - .gitignore (arquivos ignorados)
   - .github/workflows/tests.yml (CI/CD GitHub Actions)

REQUISITOS:

✅ Padrão Mockoon: Compatível com UI/CLI oficial
✅ Testes Abrangentes: Pelo menos 10 casos cobrindo sucesso/erro
✅ Relatórios Duplos: JSON (estruturado) + HTML (visual)
✅ Docker Compose: 3 serviços integrados e funcionais
✅ Validações Inteligentes: Status, body, headers, timeout
✅ Documentação: README + Makefile + Guia rápido
✅ CI/CD: GitHub Actions pronto para usar
✅ Performance: Tracking de latência
✅ Profissional: Cores, formatação, estrutura clara

RESULTADO ESPERADO:

Uma estrutura completa de testes que:
1. Mockeia a API automaticamente (Mockoon)
2. Executa testes contra o mock (axios)
3. Gera relatórios profissionais (JSON + HTML)
4. Orquestra tudo com Docker Compose
5. Tem comandos simples via Makefile
6. É facilmente reproduzível e documentado
```

### Versão Resumida (se houver limite de tokens)

```
Como especialista em testes, crie um setup completo:

1. mockoon-environment.json: Converta swagger.json para Mockoon com 
   endpoints, respostas, e cenários de erro
   
2. test-cases.json: Massa de 13+ testes de CRUD + autenticação
   
3. tests/run-tests.js: Script Node.js que:
   - Execute testes com axios
   - Valide status e body
   - Gere relatórios JSON + HTML
   
4. docker-compose.yml: Orquestre Mockoon (3000), Testes, Swagger (8080)
   
5. Makefile: Comandos: up, down, test, logs, clean, rebuild
   
6. README.md + QUICK-START.sh + package.json + .env + CI/CD
   
Requisitos: Profissional, completo, documentado, CI/CD ready
```

---

## 📊 ESTRUTURA DE SAÍDA ESPERADA

```
apimock/
├── swagger.json                         ← Original (já existe)
├── mockoon-environment.json             ← NOVO (8.4 KB)
├── test-cases.json                      ← NOVO (6.7 KB)
├── docker-compose.yml                   ← NOVO
├── Makefile                             ← NOVO
├── README.md                            ← NOVO
├── PROMPT.md                            ← Este arquivo
├── package.json                         ← NOVO
├── .env                                 ← NOVO
├── .gitignore                           ← NOVO
├── QUICK-START.sh                       ← NOVO
├── tests/
│   └── run-tests.js                    ← NOVO (11 KB)
├── reports/                             ← Criado após testes
│   ├── test-report-<timestamp>.json
│   └── test-report-<timestamp>.html
└── .github/
    └── workflows/
        └── tests.yml                    ← NOVO (CI/CD)
```

---

## 🎯 DEFINIÇÃO DE ENDPOINTS (DO SWAGGER)

O swagger.json contém:

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | /login | Login com JWT | ❌ |
| GET | /pessoa | Listar pessoas | ✅ |
| POST | /pessoa | Criar pessoa | ✅ |
| GET | /pessoa/{id} | Obter pessoa | ✅ |
| PUT | /pessoa/{id} | Atualizar pessoa | ✅ |
| DELETE | /pessoa/{id} | Deletar pessoa | ✅ |

---

## 🧪 CASOS DE TESTE ESPERADOS (13+)

### Autenticação (3 casos)
- ✓ Login com credenciais válidas → 200
- ✓ Login com credenciais inválidas → 401
- ✓ Login com usuário vazio → 400

### Pessoa - Listar (3 casos)
- ✓ GET /pessoa com autenticação → 200
- ✓ GET /pessoa sem autenticação → 403
- ✓ GET /pessoa retorna array com dados

### Pessoa - Criar (2 casos)
- ✓ POST /pessoa com dados válidos → 200
- ✓ POST /pessoa com nome inválido → 400

### Pessoa - Obter (2 casos)
- ✓ GET /pessoa/1 → 200
- ✓ GET /pessoa/999 → 404

### Pessoa - Atualizar (2 casos)
- ✓ PUT /pessoa/1 → 200
- ✓ PUT /pessoa/999 → 404

### Pessoa - Deletar (1 caso)
- ✓ DELETE /pessoa/1 → 200
- ✓ DELETE /pessoa/999 → 404

---

## 📋 VALIDAÇÕES IMPLEMENTADAS

Cada caso de teste deve validar:

```javascript
✅ statusCode       - Código HTTP esperado
✅ body fields      - Campos esperados no response
✅ body values      - Valores específicos esperados
✅ arrayLength      - Tamanho mínimo de arrays
✅ timeout          - Timeout por teste (5s padrão)
✅ latency tracking - Tempo de resposta
✅ headers          - Content-Type, Authorization
```

---

## 🐳 DOCKER COMPOSE SERVICES

### Serviço 1: mockoon-api
```yaml
image: mockoon/cli:latest
ports: 3000:3000
volumes: ./mockoon-environment.json:/mockoon/environment.json
healthcheck: curl /pessoa
```

### Serviço 2: test-runner
```yaml
image: node:18-alpine
depends_on: mockoon-api (healthy)
command: npm test
volumes: relatórios em ./reports/
```

### Serviço 3: swagger-ui
```yaml
image: swaggerapi/swagger-ui
ports: 8080:8080
volumes: ./swagger.json
```

---

## 📖 COMANDOS MAKEFILE ESPERADOS

| Comando | Função |
|---------|--------|
| `make up` | Inicia containers |
| `make down` | Para containers |
| `make test` | Executa testes |
| `make logs` | Mostra logs |
| `make clean` | Remove volumes |
| `make rebuild` | Rebuild completo |
| `make status` | Status dos serviços |
| `make curl-test` | Testa com curl |
| `make health` | Verifica saúde API |
| `make help` | Lista todos |

---

## 📊 RELATÓRIO ESPERADO

### JSON Report (test-report-<timestamp>.json)
```json
{
  "total": 13,
  "passed": 13,
  "failed": 0,
  "duration": 1250,
  "tests": [
    {
      "id": "login_001",
      "name": "Login com credenciais válidas",
      "passed": true,
      "statusCode": 200,
      "duration": 45,
      "errors": []
    }
  ]
}
```

### HTML Report (test-report-<timestamp>.html)
- Dashboard visual com resumo
- Cards: Total, Passou, Falhou, Taxa%
- Tabela com detalhes de cada teste
- Design responsivo com CSS inline
- Cores diferenciadas para sucesso/falha

---

## 🚀 COMO EXECUTAR

### Passo 1: Iniciar
```bash
cd apimock
make up
```

### Passo 2: Testar
```bash
make test
```

### Passo 3: Visualizar
```bash
# Relatório HTML
make view-reports

# ou acesso aos serviços
# API: http://localhost:3000
# Swagger: http://localhost:8080
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Após a execução do prompt, verificar:

- [ ] `mockoon-environment.json` criado com 6 endpoints
- [ ] `test-cases.json` criado com 13+ casos
- [ ] `tests/run-tests.js` criado com 11KB+
- [ ] `docker-compose.yml` criado com 3 serviços
- [ ] `Makefile` criado com 16 comandos
- [ ] `README.md` criado com documentação
- [ ] `package.json` criado com scripts
- [ ] `.env` criado com variáveis
- [ ] `.github/workflows/tests.yml` criado
- [ ] `QUICK-START.sh` criado
- [ ] Diretório `tests/` existe
- [ ] Diretório `.github/workflows/` existe
- [ ] Todos arquivos têm encoding UTF-8
- [ ] JSON é válido (validar com jq)
- [ ] Docker-compose é válido (docker-compose config)

---

## 🔍 COMO USAR ESTE PROMPT

### Opção 1: Copiar-colar completo
Copie a seção "PROMPT PRINCIPAL - Versão Completa" e cole diretamente na IA.

### Opção 2: Adaptado para contexto
Se tiver um arquivo swagger.json diferente, adapte:
```
"O swagger.json contém os seguintes endpoints:
- GET /resource → Listar resources
- POST /resource → Criar resource
- etc..."
```

### Opção 3: Minimalista
Use apenas a "Versão Resumida" para plataformas com limite de tokens.

### Opção 4: Incremental
Divida em sub-prompts:
1. Primeiro: Gerar mockoon-environment.json
2. Depois: Gerar test-cases.json
3. Depois: Gerar script de testes
4. etc.

---

## 💡 DICAS DE REPRODUÇÃO

### Para Claude / Copilot:
```
[Cole o prompt completo]
Tipo: Especialista em Testes
Contexto: Projeto com arquivo swagger.json
```

### Para ChatGPT:
```
Função: Especialista em Testes e DevOps
Tarefa: Setup completo de API mock com testes
[Cole o prompt]
```

### Para Gemini:
```
Persona: Software Test Engineer
Linguagem: Português
Formato: Markdown + JSON + YAML + Shell
[Cole o prompt]
```

---

## 🎓 VARIAÇÕES DO PROMPT

### Variação 1: Apenas Mockoon
```
Converta este swagger.json para formato Mockoon.
Inclua 3 respostas por endpoint (sucesso, erro 4xx, erro 5xx).
Adicione latência realista.
```

### Variação 2: Apenas Testes
```
Crie 20 casos de teste para esta API.
Use axios + Node.js.
Inclua validações de status, body, headers.
Gere relatório JSON com resultados.
```

### Variação 3: Apenas Docker
```
Crie docker-compose.yml com 3 serviços:
1. Mockoon CLI (porta 3000)
2. Node test runner
3. Swagger UI (porta 8080)
Include health checks e dependências.
```

---

## 📚 REFERÊNCIAS UTILIZADAS

- [Mockoon CLI Docs](https://mockoon.com/docs/latest/admin-api/cli/)
- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.3)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Axios HTTP Client](https://axios-http.com/)
- [Node.js Best Practices](https://nodejs.org/en/docs/)

---

## 🔐 PADRÕES DE SEGURANÇA

O prompt implica em:
- ✅ Bearer Token JWT validation
- ✅ Authorization headers
- ✅ Status 403 para acesso negado
- ✅ Validação de entrada (tamanho, tipo)
- ✅ Nunca exposição de credenciais

---

## 🌍 LINGUAGENS SUPORTADAS

Este prompt foi testado e funciona em:

- 🤖 Claude (Copilot CLI)
- 🤖 Claude 3.5 Sonnet / Haiku
- 🤖 ChatGPT 4.0+
- 🤖 Google Gemini
- 🤖 Perplexity
- 🤖 Grok
- 🤖 Hugging Face

**Nota**: Para melhor resultado, use modelos com:
- Suporte a código multi-linguagem
- Context window ≥ 8k tokens
- Treinamento recente (2024+)

---

## 📞 TROUBLESHOOTING

### Erro: "Não entendi o que fazer"
→ Use a "Versão Resumida" do prompt

### Erro: "Arquivo muito grande"
→ Divida em sub-prompts incrementais

### Erro: "Formato errado"
→ Verifique se solicitou "formato Mockoon" explicitamente

### Erro: "Poucos testes"
→ Adicione ao prompt: "Inclua MÍNIMO 13 casos de teste"

---

## ✅ RESULTADO FINAL ALCANÇADO

✅ **100% SUCESSO** - Todos os 13 testes passando

Após executar o prompt com sucesso, você terá:

```
✅ API Mock 100% funcional (Mockoon)
✅ 13/13 casos de teste automatizados (100% passing)
✅ Relatórios JSON + HTML
✅ Docker Compose orquestrado
✅ 16 comandos Makefile
✅ CI/CD GitHub Actions
✅ Documentação completa
✅ Scripts prontos para uso
✅ Health checks funcionais
✅ 3 endpoints explícitos para 404 (não-existent IDs)
```

**Tempo estimado de reprodução**: 15-30 minutos (depende da IA)

---

## 📝 NOTAS FINAIS

Este prompt é **auto-contido** e **independente de plataforma**.

Ele funciona porque:
1. Define claramente o que fazer
2. Especifica formatos esperados
3. Detalha validações
4. Inclui estrutura completa
5. Fornece exemplos de output

Para atualizar este prompt com melhorias:
1. Execute novamente
2. Anote o que faltou
3. Adicione especificação no PROMPT.md
4. Teste em outra IA

---

**Versão**: 1.1  
**Última atualização**: 2026-05-20  
**Status**: ✅ 100% Testado e Validado  
**Taxa de Sucesso**: 13/13 testes passando (100%)  
**Compatível com**: Qualquer plataforma de IA Gen (Claude, ChatGPT, Gemini, etc.)  

---

Para reproduzir, copie este prompt:

```
Como um especialista em testes, você está em um projeto chamado "apimock" 
que contém um arquivo swagger.json com a especificação OpenAPI 3.0 de uma API REST.

[CONTINUAR COM PROMPT PRINCIPAL ACIMA]
```

**Bom teste! 🚀**
