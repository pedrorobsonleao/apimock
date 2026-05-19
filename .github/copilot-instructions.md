# Instruções para sessões do GitHub Copilot neste repositório (apimock)

Este arquivo orienta o Copilot (e futuros assistentes) sobre como construir, testar, executar e entender rapidamente a arquitetura e convenções deste repositório.

Linguagem: Português
Escopo: execução local & em CI (Docker + Node.js)

---

## 1) Comandos de build / test / lint (exatos)

Observação: este repo não possui um `build` tradicional nem um linter configurado por padrão. Seguem os comandos úteis que existem neste projeto.

Makefile (atalhos principais):
- make up         → sob docker: inicia container(s) (usa `docker compose up -d`)
- make down       → para containers (`docker compose down`)
- make logs       → logs do mockoon (`docker compose logs -f mockoon-api`)
- make test       → executa testes no Docker (`docker compose up --abort-on-container-exit test-runner`)
- make test-local → executa testes localmente (requer Node.js): instala deps se necessário e executa `node tests/run-tests.js`
- make clean      → `docker compose down -v`
- make rebuild    → `docker compose build --no-cache && docker compose up -d`
- make health     → aguarda a API mock responder em `/pessoa`
- make curl-test  → testes rápidos via curl

npm scripts (package.json):
- npm test        → executa `node tests/run-tests.js` (mesma função do `make test-local`)
- npm run test:watch → `nodemon tests/run-tests.js` (watch)
- scripts docker:* → interagem com docker-compose (legacy: uses `docker-compose`)

Observações práticas sobre Docker vs docker-compose:
- O Makefile e os scripts usam o plugin moderno `docker compose` (sem hífen). Se sua máquina não suporta esse comando, o `package.json` usa `docker-compose` (com hífen) — ajuste conforme sua instalação (ou instale o plugin Compose V2).

Como executar um único teste (não só a suíte completa):
- Atualmente o runner principal (`tests/run-tests.js`) executa todos os casos definidos em `test-cases.json`.
- Opção rápida (não intrusiva): editar temporariamente `tests/run-tests.js` e filtrar os casos desejados. Exemplo (já documentado no README):

```js
// dentro de tests/run-tests.js, antes de executar os loops de teste
const testCases = this.testCases.pessoaTestCases.filter(t => t.id === 'pessoa_001');
```

- Alternativa sem editar: gerar um arquivo temporário contendo somente o caso alvo e apontar o runner para ele (o runner atual usa `/app/test-cases.json` quando rodando em container; para execuções locais, adapte o path no arquivo ou execute um pequeno wrapper Node que carregue o caso e invoque o executor).

---

## 2) Arquitetura de alto nível (visão única)

- mockoon-environment.json
  - Definição de ambiente Mockoon (endpoints mockados). Usado pelo container `mockoon/cli` para servir a API mock.

- docker-compose.yml
  - Orquestra três serviços:
    1. mockoon-api: Mock server (porta 3000)
    2. test-runner: Node.js (node:18-alpine) que executa `tests/run-tests.js` e grava relatórios em `reports/`
    3. swagger-ui: UI para a `swagger.json` (porta 8080)
  - Fluxo normal: mockoon-api sobe → healthcheck → test-runner executa testes contra o mock.

- test-cases.json
  - Massa de testes: objetos agrupados por feature (loginTestCases, pessoaTestCases, etc.). Cada caso contém request, expectedResponse e timeout.

- tests/run-tests.js
  - Executor principal (Node.js + axios): carrega `test-cases.json`, executa requests, valida status/body, mede latência e gera dois relatórios (JSON + HTML) em `reports/`.

- Makefile / package.json
  - Convenientes wrappers para levantar ambiente e executar testes localmente ou via Docker.

- README.md / PROMPT.md / QUICK-START.sh
  - Documentação para desenvolvedores e prompt reproducibility (PROMPT.md).

---

## 3) Convenções e padrões chave deste repositório

- Mock design:
  - Todas as rotas e respostas mockadas estão centralizadas em `mockoon-environment.json`.
  - O mock inclui respostas de sucesso e cenários de erro (2xx, 4xx, 5xx). Respeitar esse padrão ao estender respostas.

- Estrutura de casos de teste (`test-cases.json`):
  - Separado por áreas (loginTestCases, pessoaTestCases).
  - Cada caso: id, name, request (method/url/headers/body), expectedResponse (statusCode, body, bodyType, minLength), timeout.
  - Ao adicionar ou atualizar um caso, mantenha o `id` único e descritivo (p.ex. `pessoa_011`).

- Test runner expectations:
  - `tests/run-tests.js` é autorreferente: espera a massa de testes num formato específico. Se mudar `test-cases.json` preserve as chaves e formatos (ex.: expectedResponse.statusCode).
  - Runner gera relatórios em `reports/` e falha com código de saída `1` se houver falhas — ideal para CI.

- Auth / headers:
  - A maioria dos endpoints exige `Authorization: Bearer <token>` (mock aceita token qualquer). Ao simular fluxos reais, inclua headers relevantes em `test-cases.json`.

- Docker Compose / healthchecks:
  - O test-runner depende do `mockoon-api` healthy. Se o mock não subir o test-runner falhará; use `make health` para validar o mock antes de disparar testes.

- Naming / flow:
  - Rotas: usam `pessoa` como recurso de exemplo (seguindo swagger.json). Siga o mesmo padrão para novos recursos.

---

## 4) Integração com CI e Copilot

- Já existe um workflow GitHub Actions em `.github/workflows/tests.yml` que demonstra como executar os testes em CI.
- Para sessões do Copilot, recomenda-se adicionar um `copilot-setup-steps.yml` (opcional) se você quiser pré-instalar dependências (ex.: `npm ci`) ou softwares adicionais antes que o agente comece a operar.
  - Se for adicionar, defina job `copilot-setup-steps` com `contents: read` (perm) e inclua `actions/checkout` + `setup-node` + `npm ci`.

---

## 5) Checagens rápidas úteis para Copilot antes de modificar código

- Rodar `make health` para garantir que o mock esteja respondendo: `http://localhost:3000/pessoa`.
- `make test-local` para executar testes sem Docker (requer Node.js e dependências).
- Ver logs: `make logs` (mockoon) e `make logs-test` (test-runner) se algo falhar.

---

## 6) Arquivos relacionados a assistentes/IA (checados)

Nenhum arquivo específico de outras ferramentas de assistente foi detectado (CLAUDE.md, .cursorrules, AGENTS.md, .windsurfrules, CONVENTIONS.md, etc.).

---

## 7) Notas específicas para Copilot

- Se a sessão Copilot iniciar trabalhos que envolvam execução de containers, garanta que o runner suporte `docker` e `docker compose` (compose v2). Caso contrário, os comandos `make up`/`make test` podem falhar.
- Para alterações que afetam massa de testes ou mock (arquivos JSON), peça ao Copilot para validar JSON com `jq` ou `node -e "JSON.parse(...)"` antes de commitar.

---

Resumo: este arquivo cobre os comandos reais de build/test presentes no repositório, fornece um panorama de alto nível da arquitetura (mockoon + test-runner + swagger-ui), e documenta convenções específicas de testes e mocks. Peça ao Copilot para confirmar antes de aplicar mudanças amplas a `tests/run-tests.js` ou `mockoon-environment.json`.


---

Deseja que eu também configure um `copilot-setup-steps.yml` inicial (pré-instala npm deps e Node.js) no repositório para tornar sessões Copilot mais rápidas e confiáveis?