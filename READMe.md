# Escape Room Web Application – Cloud Deployment & Observability

Author: Anh Quan (Leo) Tran
Course: CSE3CWA – Web Application Development
Assignment: Escape Room Application with Cloud Deployment, Observability & Testing

## 📌 Project Overview

This project is a full-stack Escape Room web application designed to manage and play coding challenges in an interactive, game-based environment.

The system demonstrates modern web application architecture, cloud deployment, observability, and automated testing, aligning with real-world industry practices.

The application includes:

* A Next.js frontend for gameplay and question management
* A Next.js + Sequelize backend API with persistent storage
* Cloud deployment on AWS EC2
* Static website hosting using AWS S3
* Serverless dynamic content using AWS Lambda
* Full observability stack (OpenTelemetry, Jaeger, Zipkin, Prometheus)
* Automated API & UI testing using Playwright

## 🏗️ System Architecture

### Core Components

* Frontend: Next.js (App Router)
* Backend API: Next.js API routes + Sequelize ORM
* Database: SQLite (Docker volume)
* Containerisation: Docker & Docker Compose
* Cloud Platform: AWS EC2 (Free Tier)
* Static Hosting: AWS S3 (Static Website Hosting)
* Serverless: AWS Lambda
* Monitoring: OpenTelemetry Collector, Jaeger, Zipkin, Prometheus
* Testing: Playwright (API & UI tests)

All services are orchestrated using Docker Compose on a single EC2 instance.

## ☁️ Cloud Deployment (AWS EC2)

The entire application stack is deployed on an AWS EC2 instance using Docker Compose.

### Public Endpoints

* Frontend: `http://<EC2-IP>/`
* Backend API: `http://<EC2-IP>:4080/`

The EC2 instance runs:

* Frontend container
* Backend API container
* SQLite volume container
* OpenTelemetry Collector
* Jaeger
* Zipkin
* Prometheus

## 🌐 Static Website Hosting (AWS S3)

A production build of the frontend was generated using:

```bash
npm run build
```

The static output was uploaded to an AWS S3 bucket with:

* Static website hosting enabled
* Public read access via bucket policy
* `index.html` configured as the entry point

This satisfies the requirement for static website deployment in the cloud.

## 🔁 AWS Lambda – Dynamic HTML Generation

An AWS Lambda function was implemented to demonstrate dynamic page generation.

The Lambda function:

* Runs on Node.js (ES module runtime)
* Dynamically generates HTML output based on request parameters
* Can be invoked via API Gateway

This fulfills the requirement:

> “Add a Lambda function that creates dynamic pages of your HTML output.”


## 📊 Observability & Monitoring

The backend API is fully instrumented using OpenTelemetry.

### Observability Stack

* OpenTelemetry SDK (Node.js)
* OpenTelemetry Collector
* Jaeger – Distributed trace visualisation
* Zipkin – Trace dashboard
* Prometheus – Metrics collection and querying

### Service Identification

All traces are exported with:

```
service.name = api-service
```

This allows easy filtering in Jaeger and Zipkin.

## 🔌 Deployed Services & Ports

The following services are exposed on the EC2 instance:

| Service           | Port  | Description                    |
| ----------------- | ----- | ------------------------------ |
| jaegertracing     | 16686 | Jaeger Web UI                  |
| jaegertracing     | 14268 | Jaeger HTTP Receiver           |
| jaegertracing     | 14250 | Jaeger gRPC Receiver           |
| zipkin-all-in-one | 9411  | Zipkin UI & HTTP API           |
| otel-collector    | 1888  | pprof Extension                |
| otel-collector    | 8888  | Prometheus Metrics (Collector) |
| otel-collector    | 8889  | Prometheus Exporter Metrics    |
| otel-collector    | 13133 | Health Check                   |
| otel-collector    | 4317  | OTLP gRPC Receiver             |
| otel-collector    | 4318  | OTLP HTTP Receiver             |
| otel-collector    | 55679 | zPages Extension               |
| prometheus        | 9090  | Prometheus UI & API            |
| next.js           | 3000  | Next.js Development Server     |
| backend api       | 4080  | REST API Service               |

## 📈 Monitoring Dashboards

| Tool         | URL                            |
| ------------ | ------------------------------ |
| Frontend     | `http://<EC2-IP>/`             |
| Backend API  | `http://<EC2-IP>:4080/`        |
| Jaeger       | `http://<EC2-IP>:16686/`       |
| Zipkin       | `http://<EC2-IP>:9411/`        |
| Prometheus   | `http://<EC2-IP>:9090/`        |
| OTEL Metrics | `http://<EC2-IP>:8888/metrics` |

Traces such as `GET /api/questions` and database interactions are visible in Jaeger and Zipkin.

## 🔌 API Documentation

### Base URL

```
http://<EC2-IP>:4080/api/questions
```

### Endpoints

#### GET – Fetch all questions

```bash
curl -X GET http://<EC2-IP>:4080/api/questions
```

#### POST – Create a question

```bash
curl -X POST http://<EC2-IP>:4080/api/questions \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Python",
    "question": "What is a decorator?",
    "hint": "It modifies another function",
    "answer": "A function that wraps another function"
  }'
```

#### PATCH – Update a question

```bash
curl -X PATCH http://<EC2-IP>:4080/api/questions/1 \
  -H "Content-Type: application/json" \
  -d '{"hint":"Updated hint"}'
```

#### DELETE – Remove a question

```bash
curl -X DELETE http://<EC2-IP>:4080/api/questions/1
```

Duplicate questions return:

```json
{ "error": "Duplicate question not allowed" }
```

with HTTP status 409 Conflict.

## 🧪 Automated Testing (Playwright)

Automated tests were implemented using Playwright.

### Test Coverage

* ✅ REST API tests (GET, POST, PATCH, DELETE)
* ✅ Duplicate-safe logic validation
* ✅ UI workflow test (Builder Room: add, edit, delete question)

### Run tests locally or in CI

```bash
npx playwright test
```

Tests are also executed in GitHub Actions CI.

## 📦 Docker Usage

### Build containers

```bash
docker-compose build --no-cache
```

### Run application

```bash
docker-compose up
```

### Stop containers

```bash
docker-compose down
```

## ⚠️ AWS Free Tier Cost Notice

This project is deployed using an AWS Free Tier EC2 instance with limited credits.

As a result:

* The EC2 instance may be stopped after marking
* Public URLs may become unavailable in the future


## Prerequisites

Make sure the following tools are installed:

- Docker
- Docker Compose

Docker >= 25
Docker Compose >= 2

## Run the project

Clone the repository:

```bash
git clone https://github.com/your-username/CWAassignment2.git
cd CWAassignment2

Build containers:

docker compose build

Start services:

docker compose up -d

Stop services:

docker compose down