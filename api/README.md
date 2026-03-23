# Backend API – Escape Room Web Application

This backend is built with Next.js API routes, TypeScript, and Sequelize ORM to support the Escape Room web application.

It provides RESTful endpoints for managing coding challenge questions, persists data using SQLite, and includes OpenTelemetry instrumentation for tracing and metrics collection.

## Overview

The backend service is responsible for:

- exposing REST API endpoints and handling CRUD operations
- connecting to the database through Sequelize
- exporting telemetry data for observability

This service is designed to work together with the frontend application and is also containerised for deployment using Docker.

---

## Tech Stack

- Next.js (App Router / API Routes)
- TypeScript
- Sequelize ORM
- SQLite
- Sequelize CLI
- OpenTelemetry
- Docker

SQLite was chosen because:

- the project scope is relatively small
- the application runs on a single instance
- it is lightweight and requires minimal configuration

For a larger production system, a more scalable relational database such as PostgreSQL would be more appropriate.

## API Design

### Base route:

1. GET /api/questions

2. POST /api/questions

3. PATCH /api/questions/:id

4. DELETE /api/questions/:id

### Question Model

Fields include:

- id
- topic
- question
- hint
- answer


### Migrations

Database schema changes are managed using Sequelize CLI migrations.

Migration files are stored in:

```bash
migrations/
```

To run migrations:

npx sequelize-cli db:migrate

### Validation and Error Handling

The backend implements validation and error handling to ensure data integrity and robust API behaviour.

Validation includes:

- checking for required fields
- preventing duplicate questions using database-level checks

Error handling is implemented at the API route level:

- invalid requests return 400 Bad Request
- duplicate entries return 409 Conflict
- missing resources return 404 Not Found
- unexpected server errors return 500 Internal Server Error

### Observability

This backend is instrumented using OpenTelemetry.

The purpose of instrumentation is to:

- trace API requests end-to-end
- monitor backend behaviour

Telemetry is exported to the OpenTelemetry Collector and then forwarded to Jaeger, Zipkin, Prometheus

This allows visibility into request flow, latency, and backend service activity.

## Endpoints

### GET – Fetch all questions

```bash
curl -X GET http://<EC2-IP>:4080/api/questions
```

### POST – Create a question

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

### PATCH – Update a question

```bash
curl -X PATCH http://<EC2-IP>:4080/api/questions/1 \
  -H "Content-Type: application/json" \
  -d '{"hint":"Updated hint"}'
```

### DELETE – Remove a question

```bash
curl -X DELETE http://<EC2-IP>:4080/api/questions/1
```


## Local Development
1. Install dependencies
```bash
npm install
```
2. Run database migrations
```bash
npx sequelize-cli db:migrate
```
3. Start the development server
```bash
npm run dev
```
4. Open locally

Backend server:

```bash
http://localhost:3000
```

Example API route:

```bash
http://localhost:3000/api/questions
```

## Typical request flow:

- Frontend sends request to backend API
- Backend route processes request
- Sequelize interacts with SQLite
- Response is returned to the frontend

## Deployment Notes

As part of the full system, this backend has been deployed in a containerised environment on AWS EC2 together with:

- frontend service
- observability stack

Full deployment and infrastructure details are documented in the root README.