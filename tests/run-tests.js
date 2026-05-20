const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = process.env.API_URL || 'http://localhost:3000';

// Smart path resolution: Use /app paths in Docker, current directory locally
let TEST_CASES_FILE = '/app/test-cases.json';
let REPORTS_DIR = '/app/reports';

// If running locally (file doesn't exist in /app), use current directory
if (!fs.existsSync(TEST_CASES_FILE)) {
  TEST_CASES_FILE = path.join(process.cwd(), 'test-cases.json');
  REPORTS_DIR = path.join(process.cwd(), 'reports');
}

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

class TestRunner {
  constructor() {
    this.testCases = null;
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      startTime: new Date(),
      tests: [],
      environment: {
        apiUrl: API_URL,
        timestamp: new Date().toISOString()
      }
    };
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  async loadTestCases() {
    try {
      const data = fs.readFileSync(TEST_CASES_FILE, 'utf8');
      this.testCases = JSON.parse(data);
      this.log(`✓ Arquivo de testes carregado: ${TEST_CASES_FILE}`, 'blue');
    } catch (error) {
      this.log(`✗ Erro ao carregar arquivo de testes: ${error.message}`, 'red');
      process.exit(1);
    }
  }

  async makeRequest(testCase) {
    const { request } = testCase;
    const url = request.url.replace('http://localhost:3000', API_URL);

    try {
      const response = await axios({
        method: request.method,
        url: url,
        headers: request.headers || {},
        data: request.body,
        validateStatus: () => true
      });

      return response;
    } catch (error) {
      return { status: 0, data: null, error: error.message };
    }
  }

  validateResponse(response, expectedResponse) {
    const errors = [];

    // Validar status code
    if (response.status !== expectedResponse.statusCode) {
      errors.push(`Status esperado: ${expectedResponse.statusCode}, recebido: ${response.status}`);
    }

    // Validar body se esperado
    if (expectedResponse.body) {
      if (typeof expectedResponse.body === 'object') {
        for (const [key, value] of Object.entries(expectedResponse.body)) {
          if (!response.data || response.data[key] === undefined) {
            errors.push(`Campo esperado não encontrado: ${key}`);
          } else if (value !== null && response.data[key] !== value) {
            errors.push(`Campo ${key} esperado: ${value}, recebido: ${response.data[key]}`);
          }
        }
      }
    }

    // Validar tipo de body
    if (expectedResponse.bodyType === 'array' && !Array.isArray(response.data)) {
      errors.push(`Body deve ser um array`);
    }

    // Validar comprimento mínimo
    if (expectedResponse.minLength && Array.isArray(response.data)) {
      if (response.data.length < expectedResponse.minLength) {
        errors.push(`Array com tamanho mínimo esperado: ${expectedResponse.minLength}, recebido: ${response.data.length}`);
      }
    }

    return errors;
  }

  async runTest(testCase) {
    const startTime = Date.now();
    const response = await this.makeRequest(testCase);
    const duration = Date.now() - startTime;

    const errors = this.validateResponse(response, testCase.expectedResponse);
    const passed = errors.length === 0;

    const result = {
      id: testCase.id,
      name: testCase.name,
      passed,
      duration,
      statusCode: response.status,
      expectedStatus: testCase.expectedResponse.statusCode,
      errors,
      response: {
        status: response.status,
        data: response.data
      }
    };

    this.results.total++;
    if (passed) {
      this.results.passed++;
    } else {
      this.results.failed++;
    }

    this.results.tests.push(result);
    return result;
  }

  async runAllTests() {
    await this.loadTestCases();

    this.log('\n╔══════════════════════════════════════╗', 'blue');
    this.log('║   INICIANDO TESTES DA API MOCK       ║', 'blue');
    this.log('╚══════════════════════════════════════╝\n', 'blue');

    this.log(`API URL: ${API_URL}`, 'gray');
    this.log(`Tempo: ${new Date().toLocaleString()}\n`, 'gray');

    // Executar testes de autenticação
    if (this.testCases.loginTestCases) {
      this.log('📌 Testes de Autenticação', 'blue');
      this.log('─'.repeat(50), 'gray');
      for (const testCase of this.testCases.loginTestCases) {
        const result = await this.runTest(testCase);
        this.printTestResult(result);
      }
      this.log('');
    }

    // Executar testes de Pessoa
    if (this.testCases.pessoaTestCases) {
      this.log('📌 Testes de Pessoa (CRUD)', 'blue');
      this.log('─'.repeat(50), 'gray');
      for (const testCase of this.testCases.pessoaTestCases) {
        const result = await this.runTest(testCase);
        this.printTestResult(result);
      }
      this.log('');
    }

    this.printSummary();
    this.saveReport();
  }

  printTestResult(result) {
    const icon = result.passed ? '✓' : '✗';
    const color = result.passed ? 'green' : 'red';
    const status = `[${result.statusCode}/${result.expectedStatus}]`;
    const duration = `${result.duration}ms`;

    this.log(`${icon} ${result.name} ${status} ${duration}`, color);

    if (!result.passed && result.errors.length > 0) {
      for (const error of result.errors) {
        this.log(`  └─ ${error}`, 'red');
      }
    }
  }

  printSummary() {
    const duration = Date.now() - this.results.startTime.getTime();
    const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);

    this.log('╔══════════════════════════════════════╗', 'blue');
    this.log('║          RESUMO DOS TESTES          ║', 'blue');
    this.log('╠══════════════════════════════════════╣', 'blue');
    this.log(`║ Total:    ${String(this.results.total).padEnd(27)} ║`, 'blue');
    this.log(`║ ✓ Passou: ${String(this.results.passed).padEnd(27)} ║`, 'green');
    this.log(`║ ✗ Falhou: ${String(this.results.failed).padEnd(27)} ║`, this.results.failed > 0 ? 'red' : 'green');
    this.log(`║ Taxa:     ${String(`${passRate}%`).padEnd(27)} ║`, 'blue');
    this.log(`║ Tempo:    ${String(`${duration}ms`).padEnd(27)} ║`, 'blue');
    this.log('╚══════════════════════════════════════╝\n', 'blue');
  }

  saveReport() {
    if (!fs.existsSync(REPORTS_DIR)) {
      fs.mkdirSync(REPORTS_DIR, { recursive: true });
    }

    this.results.endTime = new Date();
    this.results.duration = this.results.endTime - this.results.startTime;

    const reportPath = path.join(REPORTS_DIR, `test-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));

    this.log(`📊 Relatório salvo em: ${reportPath}`, 'blue');

    // Gerar relatório HTML
    this.generateHtmlReport();
  }

  generateHtmlReport() {
    const htmlPath = path.join(REPORTS_DIR, `test-report-${Date.now()}.html`);
    const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);

    const testRows = this.results.tests.map(test => `
      <tr class="${test.passed ? 'passed' : 'failed'}">
        <td>${test.id}</td>
        <td>${test.name}</td>
        <td>${test.statusCode}/${test.expectedStatus}</td>
        <td>${test.duration}ms</td>
        <td>${test.passed ? '✓ Passou' : '✗ Falhou'}</td>
      </tr>
    `).join('');

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Testes - API Mock</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }
    .container { 
      max-width: 1200px; 
      margin: 0 auto;
      background: white;
      border-radius: 10px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      padding: 40px;
    }
    h1 { 
      color: #333;
      margin-bottom: 10px;
      text-align: center;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 3px solid #667eea;
      padding-bottom: 20px;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .summary-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .summary-card h3 { font-size: 14px; opacity: 0.9; margin-bottom: 10px; }
    .summary-card .value { font-size: 32px; font-weight: bold; }
    .passed { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
    .failed { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th {
      background: #333;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    td {
      padding: 12px;
      border-bottom: 1px solid #ddd;
    }
    tr.passed { background: #f0f9ff; }
    tr.failed { background: #fff5f5; }
    tr:hover { background: #f5f5f5; }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #666;
      font-size: 12px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Relatório de Testes - API Mock</h1>
      <p style="color: #666; margin-top: 10px;">Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
    </div>
    
    <div class="summary">
      <div class="summary-card">
        <h3>Total de Testes</h3>
        <div class="value">${this.results.total}</div>
      </div>
      <div class="summary-card passed">
        <h3>Testes Passou</h3>
        <div class="value">${this.results.passed}</div>
      </div>
      <div class="summary-card failed">
        <h3>Testes Falhou</h3>
        <div class="value">${this.results.failed}</div>
      </div>
      <div class="summary-card">
        <h3>Taxa de Sucesso</h3>
        <div class="value">${passRate}%</div>
      </div>
    </div>

    <h2 style="margin-top: 30px; margin-bottom: 15px;">Detalhes dos Testes</h2>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome do Teste</th>
          <th>Status HTTP</th>
          <th>Duração</th>
          <th>Resultado</th>
        </tr>
      </thead>
      <tbody>
        ${testRows}
      </tbody>
    </table>

    <div class="footer">
      <p>Ambiente: ${this.results.environment.apiUrl}</p>
      <p>Duração total: ${this.results.duration}ms</p>
    </div>
  </div>
</body>
</html>
    `;

    fs.writeFileSync(htmlPath, html);
    this.log(`🌐 Relatório HTML salvo em: ${htmlPath}`, 'blue');
  }
}

async function main() {
  const runner = new TestRunner();
  await runner.runAllTests();
  process.exit(runner.results.failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Erro crítico:', error);
  process.exit(1);
});
