#!/usr/bin/env bash

# 🎯 GUIA RÁPIDO - API MOCK COM MOCKOON

cat << 'EOF'

╔══════════════════════════════════════════════════════════════╗
║     🚀 GUIA RÁPIDO - API MOCK COM MOCKOON E TESTES         ║
╚══════════════════════════════════════════════════════════════╝

📦 ARQUIVOS CRIADOS
═══════════════════════════════════════════════════════════════

1. mockoon-environment.json (8.4 KB)
   └─ Configuração Mockoon com 5 endpoints:
      • POST /login → Autenticação com JWT
      • GET /pessoa → Listar pessoas
      • POST /pessoa → Criar pessoa
      • GET /pessoa/:id → Obter pessoa
      • PUT /pessoa/:id → Atualizar pessoa
      • DELETE /pessoa/:id → Deletar pessoa

2. test-cases.json (6.7 KB)
   └─ Massa de testes com 13 casos:
      • 3 casos de autenticação
      • 10 casos CRUD de pessoas
      • Validações de sucesso e erro

3. tests/run-tests.js (11 KB)
   └─ Script Node.js que executa:
      • Validação de status HTTP
      • Validação de body response
      • Medição de latência
      • Geração de relatórios JSON + HTML

4. docker-compose.yml
   └─ Orquestra 3 serviços:
      • mockoon-api (porta 3000)
      • test-runner (executa testes)
      • swagger-ui (porta 8080)

5. Makefile
   └─ Facilita operações comuns

6. README.md
   └─ Documentação completa

7. package.json
   └─ Dependências Node.js (axios)

8. .env
   └─ Variáveis de ambiente


🚀 COMEÇAR AGORA
═══════════════════════════════════════════════════════════════

1. Iniciar ambiente:
   $ make up

2. Executar testes:
   $ make test

3. Acessar serviços:
   • API: http://localhost:3000
   • Swagger: http://localhost:8080
   • Testes: ./reports/ (após executar)


💻 COMANDOS ÚTEIS
═══════════════════════════════════════════════════════════════

Gerenciamento:
  make up              Inicia containers
  make down            Para containers
  make logs            Mostra logs em tempo real
  make clean           Remove tudo
  make rebuild         Reconstrói from scratch

Testes:
  make test            Executa testes (Docker)
  make test-local      Executa testes (Local)
  make curl-test       Testa com curl
  make health          Verifica saúde da API

Info:
  make help            Mostra todos os comandos
  make status          Status dos serviços
  make info            Informações do projeto


📊 ESTRUTURA DE TESTES
═══════════════════════════════════════════════════════════════

Autenticação (3 testes):
  ✓ login_001: Credenciais válidas → 200
  ✓ login_002: Credenciais inválidas → 401
  ✓ login_003: Usuário vazio → 400

Pessoas - READ (3 testes):
  ✓ pessoa_001: Listar com auth → 200
  ✓ pessoa_002: Listar sem auth → 403
  ✓ pessoa_005: Get by ID → 200
  ✓ pessoa_006: Get inexistente → 404

Pessoas - CREATE (2 testes):
  ✓ pessoa_003: Criar válido → 200
  ✓ pessoa_004: Criar inválido → 400

Pessoas - UPDATE (2 testes):
  ✓ pessoa_007: Atualizar → 200
  ✓ pessoa_008: Update inexistente → 404

Pessoas - DELETE (2 testes):
  ✓ pessoa_009: Deletar → 200
  ✓ pessoa_010: Delete inexistente → 404


🔐 AUTENTICAÇÃO
═══════════════════════════════════════════════════════════════

Token JWT (pode usar qualquer um):
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U

Header Authorization:
  Authorization: Bearer <token>


📈 RELATÓRIOS
═══════════════════════════════════════════════════════════════

Após executar testes em ./reports/:

1. test-report-<timestamp>.json
   └─ Dados estruturados de cada teste

2. test-report-<timestamp>.html
   └─ Dashboard visual com:
      • Resumo de testes (Total/Passou/Falhou/Taxa)
      • Tabela de detalhes
      • Status HTTP de cada teste


🛠️ CUSTOMIZAÇÃO
═══════════════════════════════════════════════════════════════

Adicionar novo teste:
  1. Editar test-cases.json
  2. Reiniciar: make restart
  3. Executar: make test

Modificar resposta mock:
  1. Editar mockoon-environment.json
  2. Reiniciar: docker-compose restart mockoon-api

Alterar latência/timeout:
  1. Editar em mockoon-environment.json (latency)
  2. Editar em test-cases.json (timeout)


🐛 TROUBLESHOOTING
═══════════════════════════════════════════════════════════════

API não responde:
  $ make health
  $ make logs

Porta em uso:
  $ sudo lsof -i :3000
  $ sudo kill -9 <PID>

Limpar e recomeçar:
  $ make clean
  $ make up
  $ make test


📚 ARQUITETURA
═══════════════════════════════════════════════════════════════

swagger.json (Original)
    ↓
mockoon-environment.json (Mockoon Config)
    ↓
Docker Container (mockoon-api:3000)
    ↓
test-cases.json (Massa de Testes)
    ↓
tests/run-tests.js (Executor)
    ↓
reports/ (JSON + HTML)


🌐 INTEGRAÇÃO CI/CD
═══════════════════════════════════════════════════════════════

GitHub Actions:
  docker-compose up -d
  docker-compose run test-runner
  exit_code=$?
  docker-compose down
  exit $exit_code

GitLab CI:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker-compose up -d
    - docker-compose run test-runner
    - docker-compose down


✨ RECURSOS
═══════════════════════════════════════════════════════════════

• Mockoon CLI: https://mockoon.com/docs/latest/admin-api/cli/
• OpenAPI 3.0: https://spec.openapis.org/oas/v3.0.3
• Docker Compose: https://docs.docker.com/compose/compose-file/
• Axios: https://axios-http.com/docs/intro


═══════════════════════════════════════════════════════════════
Pronto para testes! Execute: make up && make test
═══════════════════════════════════════════════════════════════

EOF
