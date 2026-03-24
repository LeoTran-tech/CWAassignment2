// assi2/tests/api.spec.ts

// This file tests the backend with CRUD, edge case, and DB cleaned up before testing.

import { test, expect } from '@playwright/test';

const BASE_URL = 'http://ec2-13-239-184-83.ap-southeast-2.compute.amazonaws.com:4080/api/questions';

// Skip WebKit for this environment
// test.skip(({ browserName }) => browserName === 'webkit', 'WebKit not supported on this host');

test.describe('Questions API – Full CRUD Flow', () => {
  // Step 0: Clean up all questions before testing
  test.beforeAll(async ({ request }) => {
    const res = await request.get(BASE_URL);
    const questions = await res.json();
    if (Array.isArray(questions)) {
      for (const q of questions) {
        await request.delete(`${BASE_URL}/${q.id}`);
      }
    }
    console.log('Database cleaned before tests');
  });

  // Step 1: Create multiple questions
  const sampleData = [
    { topic: 'Python', question: 'What is a decorator?', hint: 'Used to wrap functions', answer: 'A wrapper function' },
    { topic: 'JavaScript', question: 'What is a closure?', hint: 'Inner function with access to parent scope', answer: 'Captures variables' },
    { topic: 'AI', question: 'What is machine learning?', hint: 'Subset of AI', answer: 'Algorithms that learn patterns from data' },
  ];

  test('POST /api/questions creates questions', async ({ request }) => {
    for (const payload of sampleData) {
      const res = await request.post(BASE_URL, {
        data: payload,
        headers: { 'Content-Type': 'application/json' },
      });
      expect(res.status(), `Failed to create: ${payload.question}`).toBe(201);
    }
  });

  // Step 2: Retrieve all questions
  test('GET /api/questions returns all records', async ({ request }) => {
    const res = await request.get(BASE_URL);
    expect(res.status()).toBe(200);

    const data = await res.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThanOrEqual(sampleData.length);
  });

  // Step 3: Retrieve by topic
  test('GET /api/questions?topic=Python filters correctly', async ({ request }) => {
    const res = await request.get(`${BASE_URL}?topic=Python`);
    expect(res.status()).toBe(200);

    const data = await res.json();
    expect(data[0].topic).toBe('Python');
  });

  // Step 4: Update one record
  test('PATCH /api/questions/:id updates a question', async ({ request }) => {
    // Get a Python question
    const getRes = await request.get(`${BASE_URL}?topic=Python`);
    const data = await getRes.json();
    const id = data[0]?.id;
    expect(id).toBeDefined();

    const updateRes = await request.patch(`${BASE_URL}/${id}`, {
      data: { hint: 'Updated hint for testing' },
      headers: { 'Content-Type': 'application/json' },
    });

    expect([200]).toContain(updateRes.status());
  });

  // Step 5: Try creating a duplicate (should 409)
  test('POST /api/questions with duplicate question returns 409', async ({ request }) => {
    const duplicate = {
      topic: 'Python',
      question: 'What is a decorator?', // duplicate question
      hint: 'dup',
      answer: 'dup',
    };

    const res = await request.post(BASE_URL, {
      data: duplicate,
      headers: { 'Content-Type': 'application/json' },
    });

    expect(res.status()).toBe(409);
  });

  // Step 6: PATCH expect duplicate (trying to rename one question to match another)
  test('PATCH /api/questions/:id with duplicate question text returns 409', async ({ request }) => {
    // Get IDs of first two questions
    const allRes = await request.get(BASE_URL);
    const list = await allRes.json();

    const first = list.find((q: any) => q.topic === 'Python');
    const second = list.find((q: any) => q.topic === 'AI');

    expect(first?.id).toBeDefined();
    expect(second?.id).toBeDefined();

    // Try to make the second question have the same text as the first
    const patchRes = await request.patch(`${BASE_URL}/${second.id}`, {
      data: { question: first.question },
      headers: { 'Content-Type': 'application/json' },
    });

    expect(patchRes.status()).toBe(409);
  });

  // Step 7: Delete one record
  test('DELETE /api/questions/:id removes a record', async ({ request }) => {
    const getRes = await request.get(`${BASE_URL}?topic=JavaScript`);
    const list = await getRes.json();
    const id = list[0]?.id;
    expect(id).toBeDefined();

    const delRes = await request.delete(`${BASE_URL}/${id}`);
    expect([200]).toContain(delRes.status());
  });

  // Step 8: Confirm deletion
  test('GET after delete should not include deleted record', async ({ request }) => {
    const res = await request.get(`${BASE_URL}?topic=JavaScript`);
    expect(res.status()).toBe(200);

    const data = await res.json();
    expect(data.length).toBe(0); // should be gone
  });
});
