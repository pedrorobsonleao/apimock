.PHONY: help up down logs test clean rebuild stop start

help:
	@echo "╔════════════════════════════════════════════════╗"
	@echo "║   API Mock com Mockoon - Comandos Disponíveis  ║"
	@echo "╠════════════════════════════════════════════════╣"
	@echo "║ make up         → Inicia os containers         ║"
	@echo "║ make down       → Para os containers           ║"
	@echo "║ make logs       → Visualiza logs em tempo real  ║"
	@echo "║ make test       → Executa testes automatizados  ║"
	@echo "║ make clean      → Limpa volumes e dados        ║"
	@echo "║ make rebuild    → Reconstrói os containers    ║"
	@echo "║ make stop       → Para os containers          ║"
	@echo "║ make start      → Inicia os containers        ║"
	@echo "║ make status     → Verifica status dos serviços ║"
	@echo "║ make health     → Verifica saúde da API       ║"
	@echo "║ make curl-test  → Testa API com curl          ║"
	@echo "╚════════════════════════════════════════════════╝"

up:
	@echo "🚀 Iniciando containers..."
	docker-compose up -d
	@echo "✓ Containers iniciados"
	@echo "📌 Mockoon API: http://localhost:3000"
	@echo "📌 Swagger UI: http://localhost:8080"
	@sleep 5
	@make health

down:
	@echo "🛑 Parando containers..."
	docker-compose down
	@echo "✓ Containers parados"

logs:
	@echo "📋 Exibindo logs (Ctrl+C para sair)..."
	docker-compose logs -f mockoon-api

logs-test:
	@echo "📋 Exibindo logs dos testes..."
	docker-compose logs test-runner

logs-swagger:
	@echo "📋 Exibindo logs do Swagger UI..."
	docker-compose logs swagger-ui

test:
	@echo "🧪 Executando testes automatizados..."
	docker-compose up --abort-on-container-exit test-runner
	@echo "✓ Testes finalizados"

test-local:
	@echo "🧪 Executando testes localmente..."
	@if [ ! -d "node_modules" ]; then npm install; fi
	@node tests/run-tests.js

clean:
	@echo "🧹 Limpando containers e volumes..."
	docker-compose down -v
	@echo "✓ Limpeza concluída"

rebuild:
	@echo "🔄 Reconstruindo containers..."
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
	@echo "✓ Rebuild concluído"

stop:
	@echo "⏸️  Parando containers..."
	docker-compose stop

start:
	@echo "▶️  Iniciando containers..."
	docker-compose start

status:
	@echo "📊 Status dos serviços:"
	@docker-compose ps

health:
	@echo "❤️  Verificando saúde da API..."
	@until curl -s http://localhost:3000/pessoa > /dev/null; do \
		echo "⏳ Aguardando API iniciar..."; \
		sleep 2; \
	done
	@echo "✓ API está saudável"
	@curl -s -H "Authorization: Bearer token" http://localhost:3000/pessoa | head -20
	@echo ""

curl-test:
	@echo "🧪 Testando com curl..."
	@echo "\n1️⃣  GET /pessoa (sem autenticação - deve retornar 403)"
	@curl -v http://localhost:3000/pessoa 2>&1 | grep "< HTTP"
	@echo "\n2️⃣  GET /pessoa (com autenticação - deve retornar 200)"
	@curl -s -H "Authorization: Bearer token" http://localhost:3000/pessoa | jq . 2>/dev/null || echo "jq não instalado, mostrando resposta bruta..." && curl -s -H "Authorization: Bearer token" http://localhost:3000/pessoa
	@echo "\n3️⃣  POST /login"
	@curl -s -X POST http://localhost:3000/login \
		-H "Content-Type: application/json" \
		-d '{"username":"admin","password":"password123"}' | jq . 2>/dev/null || curl -s -X POST http://localhost:3000/login \
		-H "Content-Type: application/json" \
		-d '{"username":"admin","password":"password123"}'
	@echo "\n4️⃣  GET /pessoa/1 (com autenticação)"
	@curl -s -H "Authorization: Bearer token" http://localhost:3000/pessoa/1 | jq . 2>/dev/null || curl -s -H "Authorization: Bearer token" http://localhost:3000/pessoa/1
	@echo "\n✓ Testes com curl concluídos"

shell:
	@echo "🐚 Abrindo shell no container Mockoon..."
	docker-compose exec mockoon-api sh

view-reports:
	@echo "📊 Abrindo relatórios de teste..."
	@if [ -f "reports/test-report.html" ]; then \
		open reports/test-report.html; \
	else \
		echo "Nenhum relatório encontrado em reports/"; \
		ls -la reports/ 2>/dev/null || echo "Diretório reports/ não existe"; \
	fi

info:
	@echo "ℹ️  Informações do Projeto"
	@echo "════════════════════════════════════════"
	@echo "📝 Swagger: /swagger.json"
	@echo "🎯 Mockoon: mockoon-environment.json"
	@echo "🧪 Testes: test-cases.json"
	@echo "📄 Testes: tests/run-tests.js"
	@echo "🐳 Docker: docker-compose.yml"
	@echo "════════════════════════════════════════"

version:
	@echo "Verificando versões dos serviços..."
	@docker --version
	@docker-compose --version
	@echo ""
	@docker-compose images
