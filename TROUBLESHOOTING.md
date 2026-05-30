# 🔧 Troubleshooting - Guia de Solução de Problemas

## Problemas Comuns

### 1. Containers não iniciando

**Sintoma**: `make up` ou `docker compose up` não completa

**Diagnóstico**:
```bash
docker compose ps              # Ver status dos containers
docker compose logs mockoon-api # Ver logs específicos
docker compose logs nginx-proxy
```

**Soluções**:

a) Porta já em uso
```bash
# Verificar se porta 80 está em uso
netstat -ln | grep 80
# Ou mudar porta no docker-compose.yml
```

b) Erro de imagem
```bash
# Pull images novamente
docker compose pull
docker compose up -d
```

c) Problema com volume
```bash
# Remover containers e volumes
make clean
# Reiniciar
make up
```

---

### 2. CORS Error ao acessar Swagger UI

**Sintoma**:
```
Fetch error
Possible cross-origin (CORS) issue?
```

**Diagnóstico**:
```bash
# Verificar se nginx está rodando
docker compose ps | grep nginx

# Testar CORS headers
curl -v http://localhost/api/health | grep Access-Control

# Verificar swagger.json
cat swagger.json | grep servers
```

**Soluções**:

a) Nginx não está rodando
```bash
docker compose up -d nginx-proxy
```

b) Swagger apontando para URL errada
```bash
# Corrigir swagger.json
# servers[0].url deve ser: "http://localhost/api"
python3 << 'EOF'
import json
with open('swagger.json', 'r') as f:
    s = json.load(f)
s['servers'] = [{"url": "http://localhost/api"}]
with open('swagger.json', 'w') as f:
    json.dump(s, f)
EOF

docker compose restart swagger-ui
```

c) Headers CORS não presentes
```bash
# Verificar mockoon-environment.json tem headers CORS
curl -v http://localhost:3000/health | grep Access-Control
```

---

### 3. Testes falhando

**Sintoma**: `make test-local` retorna erros

**Diagnóstico**:
```bash
# Ver logs completos
make logs
make logs-test

# Executar um teste específico
# Editar tests/run-tests.js e filtrar teste
```

**Soluções**:

a) API não está respondendo
```bash
make health
curl http://localhost:3000/health
```

b) Teste cases inválido
```bash
# Validar JSON
node -e "JSON.parse(require('fs').readFileSync('test-cases.json', 'utf8'))"
```

c) Erro de autenticação
```bash
# Verificar token no test-cases.json
grep -i "bearer\|token" test-cases.json
```

d) Timeout
```bash
# Aumentar timeout em test-cases.json
# Procure por "timeout": 5000
# Aumente para 10000
```

---

### 4. Relatórios não sendo gerados

**Sintoma**: Diretório `reports/` está vazio depois dos testes

**Diagnóstico**:
```bash
ls -la reports/
# Deve ter arquivos test-report-*.json e .html
```

**Soluções**:

a) Permissões incorretas
```bash
# Corrigir com Docker
docker run --rm -v /caminho/para/reports:/r alpine \
  sh -c "chmod -R 777 /r"
```

b) Erro ao salvar
```bash
# Ver erro completo
make test-local 2>&1 | tail -20
```

c) Diretório não existe
```bash
mkdir -p reports
```

---

### 5. Mockoon retornando erros inesperados

**Sintoma**: Endpoints retornando status diferente do esperado

**Diagnóstico**:
```bash
# Testar endpoint específico
curl -v http://localhost:3000/pessoa/1 \
  -H "Authorization: Bearer token-teste"

# Ver logs do mockoon
docker compose logs mockoon-api | grep -i pessoa
```

**Soluções**:

a) Rules não configuradas corretamente
```bash
# Editar mockoon-environment.json
# Verificar section "rules" em cada resposta
```

b) Request não bate com rules
```bash
# Exemplo: se rule espera "admin" em username
# Mas você envia "root", não vai dar match
# Verifique test-cases.json
```

c) Ordem das respostas importa
```bash
# Em mockoon-environment.json
# Respostas mais específicas devem vir ANTES
# Exemplo: /pessoa/999 deve estar antes de /pessoa/:id
```

---

### 6. Performance lenta

**Sintoma**: Testes levam muito tempo para executar

**Diagnóstico**:
```bash
# Ver tempo de cada teste
cat reports/test-report-*.json | jq '.tests[] | {id, duration}'

# Ver recursos disponíveis
docker stats
```

**Soluções**:

a) Docker com pouca memória
```bash
# Docker Desktop settings
# Aumentar CPU/Memory alocado
```

b) Latência artificial muito alta
```bash
# Editar mockoon-environment.json
# Procurar por "latency": 1000
# Reduzir para 0 ou 100
```

c) Timeout muito curto
```bash
# Aumentar timeout em test-cases.json
# De 5000 para 10000 ou 15000
```

---

### 7. Erro: "Address already in use"

**Sintoma**: 
```
Error: listen EADDRINUSE: address already in use :::80
```

**Diagnóstico**:
```bash
# Ver o que está usando a porta
docker compose ps
docker ps -a

# Ou limpar tudo
docker compose down -v
```

**Soluções**:

a) Container antigo ainda rodando
```bash
docker compose down
docker compose up -d
```

b) Outro serviço usando port 80
```bash
# Parar nginx localmente se estiver rodando
# Ou mudar porta em docker-compose.yml:
# ports:
#   - "8000:80"  # Usar 8000 em vez de 80
```

---

### 8. Erro de rede entre containers

**Sintoma**: Containers não conseguem se comunicar

**Diagnóstico**:
```bash
# Testar dentro do container nginx
docker compose exec nginx-proxy \
  curl http://mockoon-api:3000/health

# Ver network
docker network inspect api-network
```

**Soluções**:

a) Container não está na network
```bash
# Verificar docker-compose.yml
# Seção "networks:" deve conter:
# networks:
#   - api-network
```

b) Nome do host incorreto
```bash
# Em nginx.conf use:
# upstream mockoon_api {
#   server mockoon-api:3000;  # Nome exato
# }
```

---

### 9. Git não consegue fazer commit

**Sintoma**: `git commit` falha ou não deixa fazer push

**Diagnóstico**:
```bash
git status
git log --oneline | head -5
```

**Soluções**:

a) Arquivos não tracked
```bash
git add .
git commit -m "message"
```

b) Conflito de merge
```bash
git status
# Resolver conflitos em arquivos listados
git add .
git commit -m "Resolved conflicts"
```

---

### 10. Swagger UI não carrega

**Sintoma**: http://localhost retorna erro ou page em branco

**Diagnóstico**:
```bash
curl http://localhost
docker compose logs swagger-ui
docker compose ps | grep swagger
```

**Soluções**:

a) Swagger não está rodando
```bash
docker compose up -d swagger-ui
```

b) Nginx não está rotando corretamente
```bash
# Verificar nginx.conf
# Location / deve apontar para swagger-ui:8080
```

c) swagger.json não é válido
```bash
node -e "JSON.parse(require('fs').readFileSync('swagger.json', 'utf8'))"
```

---

## Checklist de Debug

Se algo não funciona:

- [ ] `docker compose ps` - todos containers running?
- [ ] `docker compose logs` - há erros?
- [ ] `curl http://localhost:3000/health` - API responde?
- [ ] `curl http://localhost/api/health` - Nginx proxy funciona?
- [ ] `curl http://localhost` - Swagger UI carrega?
- [ ] `cat test-cases.json | node -e "JSON.parse(require('fs').readFileSync(0))"` - JSON válido?
- [ ] `ls -la reports/` - Permissões corretas?

## Comandos Úteis para Debug

```bash
# Ver tudo
docker compose logs -f

# Ver service específico
docker compose logs -f mockoon-api

# Entrar no container
docker compose exec mockoon-api sh
docker compose exec nginx-proxy sh

# Testar conectividade
docker compose exec nginx-proxy ping mockoon-api
docker compose exec test-runner ping mockoon-api

# Ver network
docker network ls
docker network inspect apimock_api-network

# Limpar tudo
docker compose down -v
docker system prune -a
```

## Contato / Escalation

Se o problema persistir:

1. Colete logs:
```bash
docker compose logs > logs.txt
docker compose ps >> logs.txt
```

2. Verifique commits recentes:
```bash
git log --oneline -10
```

3. Descreva o problema:
- Quando começou?
- O que tentou fazer?
- Qual foi o erro exato?
- Qual o output de `docker compose ps`?

---

**Última Atualização**: May 29, 2026
**Status**: ✅ Documento Completo
