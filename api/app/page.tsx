'use client';

import React, { useEffect, useState } from 'react';

const getPathUrl = () => {
  if (typeof window !== 'undefined') {
    return new URL(window.location.href).origin.replace(/\/$/, '');
  }
  return ''; // SSR fallback
};

const ApiDocumentation: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(getPathUrl());
  }, []);

  return (
    <div style={{ padding: '24px', fontFamily: 'Arial, sans-serif', lineHeight: 1.6 }}>
      <h1 style={{ color: '#0070f3' }}>Escape Room API Documentation</h1>
      <p>
        Welcome to the <strong>Escape Room Question Database API</strong>.<br />
        This service manages <code>topics</code>, <code>questions</code>, <code>hints</code>, and <code>answers</code>.
      </p>

      <hr />

      <h2>Available Endpoints</h2>

      <ul>
        <li><strong>GET</strong> — Fetch questions (optionally by topic)</li>
        <li><strong>POST</strong> — Add a new question</li>
        <li><strong>PATCH</strong> — Update an existing question</li>
        <li><strong>DELETE</strong> — Delete a question by ID</li>
      </ul>

      <hr />

      <h3>1️⃣ GET Request</h3>
      <p>Retrieve all questions or filter by topic.</p>
      <pre>
        <code>{`
curl -X GET ${baseUrl}/api/questions
# or by topic
curl -X GET "${baseUrl}/api/questions?topic=Python"
        `}</code>
      </pre>

      <h4>PowerShell Equivalent</h4>
      <pre>
        <code>{`
Invoke-RestMethod -Uri "${baseUrl}/api/questions?topic=Python" -Method Get
        `}</code>
      </pre>

      <hr />

      <h3>2️⃣ POST Request</h3>
      <p>Add a new question entry.</p>
      <pre>
        <code>{`
curl -X POST ${baseUrl}/api/questions \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "Python",
    "question": "What is a decorator?",
    "hint": "It modifies functions",
    "answer": "A function that wraps another function"
  }'
        `}</code>
      </pre>

      <h4>PowerShell Equivalent</h4>
      <pre>
        <code>{`
Invoke-RestMethod -Uri "${baseUrl}/api/questions" -Method Post -ContentType "application/json" -Body '{
  "topic": "Python",
  "question": "What is a decorator?",
  "hint": "It modifies functions",
  "answer": "A function that wraps another function"
}'
        `}</code>
      </pre>

      <hr />

      <h3>3️⃣ PATCH Request</h3>
      <p>Update an existing question (by ID).</p>
      <pre>
        <code>{`
curl -X PATCH "${baseUrl}/api/questions?id=1" \\
  -H "Content-Type: application/json" \\
  -d '{"hint": "Used for wrapping or enhancing functions"}'
        `}</code>
      </pre>

      <h4>PowerShell Equivalent</h4>
      <pre>
        <code>{`
Invoke-RestMethod -Uri "${baseUrl}/api/questions?id=1" -Method Patch -ContentType "application/json" -Body '{
  "hint": "Used for wrapping or enhancing functions"
}'
        `}</code>
      </pre>

      <hr />

      <h3>4️⃣ DELETE Request</h3>
      <p>Remove a question by ID.</p>
      <pre>
        <code>{`
curl -X DELETE "${baseUrl}/api/questions?id=1" -H "Content-Type: application/json"
        `}</code>
      </pre>

      <h4>PowerShell Equivalent</h4>
      <pre>
        <code>{`
Invoke-RestMethod -Uri "${baseUrl}/api/questions?id=1" -Method Delete
        `}</code>
      </pre>

      <hr />

      <footer style={{ marginTop: '24px', fontSize: '0.9rem', color: '#555' }}>
        <p>© 2025 Escape Room API — Powered by Sequelize + SQLite</p>
      </footer>
    </div>
  );
};

export default ApiDocumentation;
