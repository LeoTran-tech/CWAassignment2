# Escape Room Web Application – Cloud Deployment & Observability

**Author:** Anh Quan (Leo) Tran
**Course:** CSE3CWA – Web Application Development
**Assignment:** Escape Room Application with Cloud Deployment, Observability & Testing


## 📌 Project Overview

This project is a full-stack **Escape Room web application** designed to manage and play coding challenges in an interactive environment.

The application consists of:

* A **Next.js frontend** for gameplay and question management
* A **Next.js + Sequelize backend API** with SQLite persistence
* A **cloud deployment on AWS EC2**
* **Static website hosting on AWS S3**
* **Observability and monitoring** using OpenTelemetry, Jaeger, Zipkin, and Prometheus
* **Automated testing** with Playwright (API + UI)

## 🏗️ System Architecture

### Core Components

* **Frontend:** Next.js (App Router)
* **Backend API:** Next.js API routes + Sequelize ORM
* **Database:** SQLite (containerized volume)
* **Containerization:** Docker & Docker Compose
* **Cloud Platform:** AWS EC2 (Free Tier)
* **Static Hosting:** AWS S3 (Static Website Hosting)
* **Monitoring:** OpenTelemetry Collector, Jaeger, Zipkin, Prometheus
* **Testing:** Playwright (API & UI tests)

## ☁️ Cloud Deployment

### AWS EC2

The entire application stack is deployed on an AWS EC2 instance using Docker Compose.

Exposed services:

* **Frontend:** `http://<EC2-IP>/`
* **Backend API:** `http://<EC2-IP>:4080/`

Docker Compose orchestrates:

* Frontend container
* API container
* SQLite volume holder
* OpenTelemetry Collector
* Jaeger
* Zipkin
* Prometheus


## 🌐 Static Website Hosting (AWS S3)

A production build of the frontend was generated using:

```bash
npm run build
```

The static output was uploaded to an **S3 bucket** with:

* Static website hosting enabled
* Public read access via bucket policy
* `index.html` configured as the entry point

This satisfies the requirement for **static website deployment in the cloud**.


## 🔁 AWS Lambda – Dynamic Page Generation

An AWS Lambda function was implemented to demonstrate **dynamic content generation**.

The Lambda:

* Runs on **Node.js (ES module)**
* Dynamically returns HTML content based on request parameters
* Can be triggered via API Gateway

This fulfills the requirement to:

> “Add a lambda function that creates dynamic pages of your HTML output.”

## 📊 Observability & Monitoring

The application is fully instrumented using **OpenTelemetry**.

### Observability Stack

* **OpenTelemetry SDK (Node.js)**
* **OpenTelemetry Collector**
* **Jaeger** – Trace visualization
* **Zipkin** – Distributed tracing
* **Prometheus** – Metrics collection

### Service Name

All backend traces are reported under:

```
service.name = api-service
```

### Dashboards

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

#### GET – Fetch questions

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

Duplicate entries return:

```json
{ "error": "Duplicate question not allowed" }
```

with HTTP status `409`.

## 🧪 Automated Testing

Automated tests were implemented using **Playwright**.

### Test Coverage

* ✅ API endpoint tests (GET, POST, PATCH, DELETE)
* ✅ Duplicate handling
* ✅ UI workflow test (Builder Room: add, edit, delete question)

### Run tests

```bash
npx playwright test
```

All tests pass successfully after handling duplicate-safe logic.


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
