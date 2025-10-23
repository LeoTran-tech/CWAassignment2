'use client';

import React, { useEffect, useState } from 'react';

const getPathUrl = () => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    return `${url.protocol}//${url.hostname}`; // remove port for cleaner base URL
  }
  return '';
};

const ApiDocumentation: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(getPathUrl());
  }, []);

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
      <style>{`
        h1 { font-size: 2em; color: #0070f3; font-weight: bold; margin-bottom: 0.5em; }
        h2 { font-size: 1.5em; font-weight: bold; margin-top: 1.2em; }
        h3 { font-size: 1.2em; font-weight: bold; margin-top: 1em; }
        code { padding: 2px 5px; border-radius: 4px; }
        pre { padding: 10px; border-radius: 6px; overflow-x: auto; }
        a { color: #0070f3; text-decoration: none; }
        a:hover { text-decoration: underline; }
      `}</style>

      {/* ===================================== */}
      {/* PART 1: Escape Room API Documentation */}
      {/* ===================================== */}
      <h1>Escape Room API Documentation</h1>
      <p>
        The Escape Room API provides endpoints to manage coding challenge questions, hints, and answers.
      </p>
      <p>
        Base URL: <code>{baseUrl}:4080/api/questions</code>
      </p>

      <hr />
      <br />
      <h3>1️⃣ GET Request</h3>
      <p>Fetch all questions, or filter by topic:</p>
      <pre>
        <code>{`curl -X GET ${baseUrl}:4080/api/questions`}</code>
      </pre>
      <p>Filter by topic:</p>
      <pre>
        <code>{`curl -X GET "${baseUrl}:4080/api/questions?topic=Python"`}</code>
      </pre>

      <p><strong>PowerShell equivalent:</strong></p>
      <pre>
        <code>{`Invoke-RestMethod -Uri "${baseUrl}:4080/api/questions?topic=Python" -Method Get`}</code>
      </pre>

      <hr />
      <br />
      <h3>2️⃣ POST Request</h3>
      <p>Create a new question entry:</p>
      <pre>
        <code>{`curl -X POST ${baseUrl}:4080/api/questions -H "Content-Type: application/json" -d "{\"topic\":\"Python\",\"question\":\"What is a decorator?\",\"hint\":\"It modifies another function\",\"answer\":\"A function that wraps another function\"}"`}</code>
      </pre>

      <p><strong>PowerShell equivalent:</strong></p>
      <pre>
        <code>{`Invoke-RestMethod -Uri "${baseUrl}:4080/api/questions" -Method Post -ContentType "application/json" -Body '{"topic":"Python","question":"What is a decorator?","hint":"It modifies another function","answer":"A function that wraps another function"}'`}</code>
      </pre>

      <hr />
      <br />
      <h3>3️⃣ PATCH Request</h3>
      <p>Update an existing question (by ID):</p>
      <pre>
        <code>{`curl -X PATCH ${baseUrl}:4080/api/questions/1 -H "Content-Type: application/json" -d "{\"hint\":\"Used for wrapping or enhancing functions\"}"`}</code>
      </pre>

      <p><strong>PowerShell equivalent:</strong></p>
      <pre>
        <code>{`Invoke-RestMethod -Uri "${baseUrl}:4080/api/questions/1" -Method Patch -ContentType "application/json" -Body '{"hint":"Used for wrapping or enhancing functions"}'`}</code>
      </pre>

      <hr />
      <br />
      <h3>4️⃣ DELETE Request</h3>
      <p>Delete a question (by ID):</p>
      <pre>
        <code>{`curl -X DELETE ${baseUrl}:4080/api/questions/1`}</code>
      </pre>

      <p><strong>PowerShell equivalent:</strong></p>
      <pre>
        <code>{`Invoke-RestMethod -Uri "${baseUrl}:4080/api/questions/1" -Method Delete`}</code>
      </pre>

      <footer style={{ marginTop: '24px', fontSize: '0.9rem', color: '#555' }}>
        <p>© 2025 Escape Room API — Powered by Next.js + Sequelize + SQLite</p>
      </footer>

      <hr style={{ margin: '40px 0' }} />

      {/* ===================================== */}
      {/* PART 2: Monitoring Dashboard Links   */}
      {/* ===================================== */}
      <h1>Monitoring & Observability Dashboards</h1>
      <p>
        The observability stack below includes Jaeger, Zipkin, Prometheus, and OpenTelemetry metrics.
      </p>

      <h2>Frontend Application</h2>
      <p>
        <a href={`${baseUrl}:80/`} target="_blank" rel="noopener noreferrer">
          {baseUrl}:80/
        </a>
      </p>

      <h2>Backend API</h2>
      <p>
        <a href={`${baseUrl}:4080/`} target="_blank" rel="noopener noreferrer">
          {baseUrl}:4080/
        </a>
      </p>

      <h2>Jaeger (Trace Viewer)</h2>
      <p>
        Search for service: <strong>api-service</strong>
        <br />
        <a href={`${baseUrl}:16686/`} target="_blank" rel="noopener noreferrer">
          {baseUrl}:16686/
        </a>
      </p>

      <h2>Zipkin (Trace Dashboard)</h2>
      <p>
        Set <strong>serviceName</strong> = <code>api-service</code> then click “Run Query”.
        <br />
        <a href={`${baseUrl}:9411/`} target="_blank" rel="noopener noreferrer">
          {baseUrl}:9411/
        </a>
      </p>

      <h2>Prometheus Metrics</h2>
      <p>
        Query metric names like <code>otelcol_exporter_sent_spans</code> or <code>http_server_duration_seconds_count</code>.
        <br />
        <a href={`${baseUrl}:9090/`} target="_blank" rel="noopener noreferrer">
          {baseUrl}:9090/
        </a>
      </p>

      <h2>OpenTelemetry Collector Metrics</h2>
      <p>
        <a href={`${baseUrl}:8888/metrics`} target="_blank" rel="noopener noreferrer">
          {baseUrl}:8888/metrics
        </a>
        <br />
        <a href={`${baseUrl}:8889/metrics`} target="_blank" rel="noopener noreferrer">
          {baseUrl}:8889/metrics
        </a>
      </p>

      <h2>Jaeger & Zipkin Export Validation</h2>
      <p>
        Traces appear under <code>api-service</code> when API endpoints are accessed.
        Check <strong>“fs lstat”</strong> or <strong>“GET /api/questions”</strong> spans in Jaeger and Zipkin.
      </p>

      <footer style={{ marginTop: '24px', fontSize: '0.9rem', color: '#555' }}>
        <p>Monitoring powered by OpenTelemetry Collector, Prometheus, Zipkin, and Jaeger.</p>
      </footer>
    </div >
  );
};

export default ApiDocumentation;
