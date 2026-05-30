# 🚀 CI/CD - Integração Contínua

## GitHub Actions Workflow

Existe um workflow automático em `.github/workflows/tests.yml` que executa os testes a cada push.

## Configuração Atual

### Arquivo: `.github/workflows/tests.yml`

```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - name: Run tests
        run: docker compose up --abort-on-container-exit test-runner
```

## Como Funciona

1. **Trigger**: Cada push ou pull request
2. **Runner**: Ubuntu latest (GitHub Actions)
3. **Ação**: Executa `docker compose up --abort-on-container-exit test-runner`
4. **Resultado**: Sucesso se exit code for 0 (todos testes passam)

## Requisitos

- ✅ Docker instalado no runner (padrão em ubuntu-latest)
- ✅ docker-compose v2+ (padrão em ubuntu-latest)
- ✅ Permissões de leitura no repo (padrão)

## Status Badge

Para adicionar status badge no README:

```markdown
[![Tests](https://github.com/pedrorobsonleao/apimock/actions/workflows/tests.yml/badge.svg)](https://github.com/pedrorobsonleao/apimock/actions)
```

## Próximas Melhorias

### 1. Artifact Upload
```yaml
- name: Upload test reports
  uses: actions/upload-artifact@v3
  with:
    name: test-reports
    path: reports/
```

### 2. Slack Notification
```yaml
- name: Notify Slack
  if: failure()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -d '{"text":"Tests failed!"}'
```

### 3. Performance Monitoring
```yaml
- name: Check performance
  run: |
    TIME=$(cat reports/test-report-*.json | jq '.duration')
    if [ $TIME -gt 2000 ]; then
      echo "⚠️  Tests slow: ${TIME}ms"
    fi
```

### 4. Multi-version Testing
```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
    
steps:
  - uses: actions/setup-node@v3
    with:
      node-version: ${{ matrix.node-version }}
```

### 5. Code Coverage
```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Executar Testes Localmente (Simular CI)

```bash
# Simular exato do GitHub Actions
docker compose build
docker compose up --abort-on-container-exit test-runner

# Verificar resultado
echo $?  # 0 = sucesso, 1 = falha
```

## Variáveis de Ambiente

Definidas em `docker-compose.yml`:

```yaml
environment:
  API_URL: "http://mockoon-api:3000"
  LOG_LEVEL: "debug"
```

Para CI, adicionar em `.github/workflows/tests.yml`:

```yaml
env:
  CI: true
  DEBUG: false
```

## Branches Protegidas

Recomendado em GitHub Settings → Branches:

1. Exigir que branch esteja atualizado
2. Exigir testes passando antes de merge
3. Exigir revisão de código
4. Descartar pull requests obsoletas

## Deploy Strategy

### Development
```bash
make up
make test-local
```

### Staging
```bash
docker compose -f docker-compose.prod.yml up -d
make test
```

### Production
```bash
# Usar imagens versionadas
docker pull mockoon/cli:5.0.0
docker pull nginx:1.25-alpine
```

## Monitoramento Pós-Deploy

```bash
# Health check
curl http://localhost/api/health

# Verificar logs
docker compose logs -f mockoon-api
docker compose logs -f nginx-proxy

# Testes de smoke
make curl-test
```

## Rollback

```bash
# Se algo der errado
docker compose down
git revert <commit>
docker compose up -d
```

## Métricas para Rastrear

1. **Disponibilidade**: % de tempo que API está UP
2. **Taxa de Sucesso**: % de testes passando
3. **Performance**: Tempo médio de requisição
4. **Cobertura**: % de endpoints testados
5. **Confiabilidade**: Frequência de falsos positivos

## Exemplo Completo Melhorado

```yaml
name: API Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Run tests
        run: docker compose up --abort-on-container-exit test-runner
      
      - name: Upload test reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-reports
          path: reports/
      
      - name: Check test results
        run: |
          if [ $? -ne 0 ]; then
            echo "❌ Tests failed!"
            exit 1
          else
            echo "✅ Tests passed!"
          fi
      
      - name: Slack Notification
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'API Tests: ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Troubleshooting

### Testes passam localmente mas falham no CI
```bash
# Verificar diferença de ambiente
docker compose config
# Comparar com CI logs
```

### Timeout no CI
```yaml
- name: Run tests
  timeout-minutes: 10
  run: docker compose up --abort-on-container-exit test-runner
```

### Falha de permissões
```yaml
- name: Fix permissions
  run: chmod -R 777 reports/
```

---

**Última Atualização**: May 29, 2026
**Status**: ✅ Pronto para Produção
