# Frontend – Escape Room & Code Generator Web App

This frontend is built with Next.js, React, and TypeScript as part of a web application that combines an interactive coding game, a tab-based code generator, and several supporting pages.

It demonstrates modern frontend development practices including component-based architecture, state management with React hooks, local persistence, responsive navigation, theme switching, and integration with a backend API.

## Features

### 1. Escape Room gameplay
- Interactive object-based gameplay (question, hint, answer)
- Timer-based challenge system
- Win/lose end screens
- Dynamic question selection
- Integrated Builder Room for managing questions

### 2. Builder Room (CRUD UI)
- Add, edit, and delete questions
- Real-time updates via backend API
- Table-based management interface

### 3. Code Generator (Tabs System)
- Create and manage up to 15 tabs
- Edit and persist content using `localStorage`
- Generate HTML output with inline CSS

### 4. UI & UX
- Light, Dark, and Solarized themes
- Responsive navigation with hamburger menu
- Reusable component-based design

### 5. Serverless Demo
As part of the cloud deployment exploration, the frontend was also exported as a static site and hosted on AWS S3.

Since S3 cannot execute backend logic, a lightweight AWS Lambda function was introduced to provide dynamic data via HTTP.

This demonstrates:
- S3 for static frontend hosting
- Lambda for serverless backend functionality

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Bootstrap 5
- CSS Modules
- LocalStorage
- Fetch API

## Request Flow

```text
User → Frontend → API → Database → Response → UI
```

## Backend Integration

The frontend communicates with the backend API for question management and gameplay data.
API Endpoints:
- `GET /api/questions`
- `POST /api/questions`
- `PATCH /api/questions/:id`
- `DELETE /api/questions/:id`


## Assets

Static assets are stored in public/, including:

- Escape Room background image
- Interactive object icons (SVG)
- Supporting UI assets


## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Open in browser

```bash
http://localhost:3000
```

## Build

To create a production build:

```bash
npm run build
```

To run the production build locally:

```bash
npm run start
```
This frontend also includes a Dockerfile so it can run as part of the full system using Docker Compose.

In the full project setup, the frontend runs in its own container and communicates with the backend container over the Docker network.

## Deployment Note

This frontend can be:

deployed via Docker on AWS EC2 (full-stack setup)
exported and hosted on AWS S3 (static deployment)