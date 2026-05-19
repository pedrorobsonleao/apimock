# Project Instructions: API Mock com Mockoon

This project provides a complete REST API testing environment using **Mockoon** as a mock server and **Node.js** for automated test execution, all orchestrated via **Docker Compose**.

## Project Overview

- **Purpose:** Simulate a production-like API for testing purposes, allowing for rapid development and validation of client applications or CI/CD pipelines without a real backend.
- **Architecture:** 
    - `mockoon-api`: Serves the mock endpoints (port 3000).
    - `test-runner`: Executes automated tests against the mock API using Node.js and Axios.
    - `swagger-ui`: Provides visual documentation for the API (port 8080).
- **Key Technologies:** Mockoon CLI, Node.js (v18+), Docker, Axios, Makefile.

## Core Components

- `mockoon-environment.json`: The source of truth for all mock endpoints, responses, and rules.
- `test-cases.json`: Contains the test data, including requests, expected status codes, and body validation rules.
- `tests/run-tests.js`: The main test execution script that parses `test-cases.json`, performs requests, and generates reports.
- `swagger.json`: OpenAPI 3.0 specification for the API.
- `reports/`: Directory where test results (JSON and HTML) are stored.

## Building and Running

The project uses a `Makefile` for streamlined development workflows.

### Primary Commands
- `make up`: Starts all containers in the background (`docker compose up -d`).
- `make test`: Runs the automated test suite within a Docker container.
- `make test-local`: Runs tests locally using Node.js (installs dependencies if missing).
- `make down`: Stops and removes all project containers.
- `make health`: Waits until the mock API is responsive.
- `make curl-test`: Performs a quick manual validation of key endpoints using `curl`.

### Utility Commands
- `make logs`: Follows logs for the `mockoon-api` service.
- `make status`: Shows the status of all running services.
- `make clean`: Removes containers and volumes for a fresh start.
- `make view-reports`: Opens the generated HTML test report (OS dependent).

## Development Conventions

### 1. Modifying Mocks
- All mock changes should be made in `mockoon-environment.json`.
- After modifying the mock, restart the service with `docker compose restart mockoon-api` or `make up`.
- Use **Rules** in Mockoon to simulate different scenarios (e.g., 401 for wrong passwords, 400 for short names).

### 2. Adding Test Cases
- Add new cases to `test-cases.json`.
- Each test case must have a unique `id` (e.g., `pessoa_011`).
- Supported validations: `statusCode`, `body` (partial match), `bodyType` (e.g., `array`), and `minLength` (for arrays).

### 3. Testing Logic
- The test runner (`tests/run-tests.js`) uses **Axios**.
- It generates two files in `reports/`: `test-report.json` and `test-report.html`.
- To run a specific test, you can temporarily modify the filter in `tests/run-tests.js`.

### 4. CI/CD
- A GitHub Actions workflow is available in `.github/workflows/tests.yml`.
- The `test-runner` exits with code `1` on failure, making it suitable for blocking PRs.

## Directory Structure

- `tests/`: Contains the test runner script.
- `reports/`: Test execution outputs.
- `.github/`: CI/CD workflows and assistant instructions.
- `Makefile` & `package.json`: Task automation and dependency management.

---
**Note:** This project prefers `docker compose` (Compose V2). If using an older system, ensure compatibility with `docker-compose`.
