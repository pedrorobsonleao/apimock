# 🚀 PUBLICAR NO GITHUB - GUIA PASSO A PASSO

## ✅ STATUS ATUAL

O repositório **local** já está totalmente preparado:

```
✓ Git inicializado
✓ 13 arquivos commitados
✓ Commit hash: 7e91a79
✓ Branch: master (pronto para renomear para main)
```

## 📋 PASSO 1: Criar Repositório no GitHub

### Opção A: Via Web (Mais Fácil)

1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name**: `apimock`
   - **Description**: "🎯 API Mock with Mockoon and Automated Tests"
   - **Visibility**: Public (ou Private)
   - **Initialize**: Deixe em branco (vazio)
3. Clique em "Create repository"

### Opção B: Via GitHub CLI (Requer gh instalado)

```bash
# Instalar GitHub CLI (se não tiver)
# macOS:
brew install gh

# Ubuntu/Debian:
sudo apt-get install gh

# Windows:
choco install gh

# Depois:
gh auth login                    # Fazer login
gh repo create apimock --public  # Criar repo público
```

## 📋 PASSO 2: Configurar Remote e Fazer Push

Após criar o repositório no GitHub, execute estes comandos:

```bash
# 1. Ir para o diretório do projeto
cd /home/pedroleao/Documents/Projects/apimock

# 2. Renomear branch de master para main (opcional, mas recomendado)
git branch -m master main

# 3. Adicionar remote (substitua SEU_USUARIO pelo seu usuário GitHub)
git remote add origin https://github.com/SEU_USUARIO/apimock.git

# 4. Fazer push inicial
git push -u origin main

# Ou se estiver usando SSH:
git remote add origin git@github.com:SEU_USUARIO/apimock.git
git push -u origin main
```

### Exemplo Real:

```bash
# Se seu usuário GitHub é "pedroleao":
git remote add origin https://github.com/pedroleao/apimock.git
git push -u origin main
```

## 📋 PASSO 3: Verificar Push

Após fazer push, verifique:

```bash
# Ver remotes configurados
git remote -v

# Ver histórico
git log --oneline

# Ver branch atual
git branch -a
```

## 🔑 USANDO SSH (Alternativa Mais Segura)

Se preferir SSH em vez de HTTPS:

```bash
# 1. Gerar chave SSH (se não tiver)
ssh-keygen -t ed25519 -C "seu_email@example.com"

# 2. Adicionar a chave ao ssh-agent
ssh-add ~/.ssh/id_ed25519

# 3. Copiar a chave pública
cat ~/.ssh/id_ed25519.pub
# Copie a saída

# 4. No GitHub:
#    - Acesse: https://github.com/settings/keys
#    - "New SSH key"
#    - Cole a chave copiada
#    - Salve

# 5. Configurar remote com SSH
git remote add origin git@github.com:SEU_USUARIO/apimock.git

# 6. Fazer push
git push -u origin main
```

## 📊 RESULTADO ESPERADO

Após push bem-sucedido, você verá no GitHub:

```
apimock/
├── .github/workflows/tests.yml      ← CI/CD
├── tests/run-tests.js               ← Script de testes
├── .env                             ← Variáveis
├── .gitignore                       ← Git config
├── Makefile                         ← Comandos
├── PROMPT.md                        ← Meta-documentação
├── QUICK-START.sh                   ← Guia rápido
├── README.md                        ← Documentação
├── docker-compose.yml               ← Docker config
├── mockoon-environment.json         ← Mockoon setup
├── package.json                     ← npm config
├── swagger.json                     ← OpenAPI spec
└── test-cases.json                  ← Testes

Commits: 1
Branch: main
Badges: CI/CD (GitHub Actions)
```

## 🔄 FLUXO GIT COMPLETO

```bash
# 1. Inicializar repositório (JÁ FEITO)
git init
git config user.name "Test Automation Specialist"
git config user.email "specialist@apimock.dev"

# 2. Adicionar todos os arquivos (JÁ FEITO)
git add -A

# 3. Fazer commit inicial (JÁ FEITO)
git commit -m "🎉 Initial commit: Complete API Mock setup..."

# 4. Renomear branch (A FAZER)
git branch -m master main

# 5. Adicionar remote (A FAZER)
git remote add origin https://github.com/SEU_USUARIO/apimock.git

# 6. Fazer push (A FAZER)
git push -u origin main
```

## ✨ PRÓXIMAS MELHORIAS (Após Push)

Após fazer push no GitHub, você pode:

### 1. Adicionar Badges ao README.md

```markdown
# 🎯 API Mock com Mockoon

[![GitHub Actions](https://github.com/SEU_USUARIO/apimock/workflows/API%20Tests/badge.svg)](https://github.com/SEU_USUARIO/apimock/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/SEU_USUARIO/apimock?style=social)](https://github.com/SEU_USUARIO/apimock)
```

### 2. Adicionar LICENSE

```bash
# Copiar licença MIT (exemplo)
curl https://opensource.org/licenses/MIT > LICENSE
git add LICENSE
git commit -m "docs: Add MIT license"
git push
```

### 3. Adicionar CHANGELOG.md

```bash
cat > CHANGELOG.md << 'EOF'
# Changelog

## [1.0.0] - 2026-05-19

### Added
- Initial release
- Mockoon environment with 6 endpoints
- 13 automated test cases
- Docker Compose orchestration
- GitHub Actions CI/CD
- Comprehensive documentation
EOF

git add CHANGELOG.md
git commit -m "docs: Add changelog"
git push
```

### 4. Adicionar Releases

```bash
# Via GitHub CLI:
gh release create v1.0.0 \
  --title "v1.0.0 - Initial Release" \
  --notes "Complete API Mock setup with Mockoon and automated tests"
```

## 🐛 TROUBLESHOOTING

### Erro: "fatal: A branch named 'main' already exists"

```bash
# Se der erro ao renomear:
git branch -m master main
# E depois:
git push -u origin main --force
```

### Erro: "fatal: Could not read from remote repository"

```bash
# Verificar remote:
git remote -v

# Se errado, remover e adicionar novamente:
git remote remove origin
git remote add origin https://github.com/SEU_USUARIO/apimock.git
```

### Erro: "Permission denied (publickey)"

```bash
# Se usando SSH:
ssh-keygen -t ed25519 -C "seu_email@example.com"
ssh-add ~/.ssh/id_ed25519
# Adicione a chave pública em: https://github.com/settings/keys
```

### Erro: "support for password authentication was removed"

```bash
# Use token de acesso pessoal em vez de senha:
git remote set-url origin https://SEU_USUARIO:SEU_TOKEN@github.com/SEU_USUARIO/apimock.git
git push -u origin main
```

## 📝 COMANDOS ESSENCIAIS APÓS PUSH

```bash
# Ver commits
git log --oneline

# Ver status
git status

# Ver remotes
git remote -v

# Fazer pull (atualizar local)
git pull origin main

# Fazer novo commit
git add .
git commit -m "Sua mensagem"
git push origin main

# Ver branches
git branch -a
```

## 🚀 WORKFLOW RECOMENDADO APÓS PUSH

```
Local Development
        ↓
  git add .
        ↓
  git commit -m "mensagem"
        ↓
  git push origin main
        ↓
  GitHub Repo Updated
        ↓
  GitHub Actions (CI/CD)
        ↓
  Tests Run Automatically
        ↓
  Results in PR Checks
```

## 📊 CHECKLIST FINAL

- [ ] Repositório criado no GitHub
- [ ] Remote configurado localmente
- [ ] Branch renomeado para main
- [ ] Push realizado com sucesso
- [ ] Arquivos visíveis no GitHub
- [ ] CI/CD workflow ativado
- [ ] README exibindo corretamente
- [ ] Badges adicionadas (opcional)
- [ ] LICENSE adicionada (opcional)
- [ ] CHANGELOG adicionado (opcional)

## 🎉 PRONTO!

Seu repositório está pronto para ser compartilhado!

```
URL do repositório:
https://github.com/SEU_USUARIO/apimock

Clone em outra máquina:
git clone https://github.com/SEU_USUARIO/apimock.git
cd apimock
make up
make test
```

## 📞 SUPORTE

Para problemas com Git/GitHub:
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Help](https://docs.github.com/en)
- [GitHub CLI](https://cli.github.com/)

---

**Próximo passo**: Execute o comando `git push` com os parâmetros corretos! 🚀
