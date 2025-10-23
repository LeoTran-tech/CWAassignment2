// assi2/tests/api.spec.ts
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://ec2-3-85-115-208.compute-1.amazonaws.com:4080/api/questions';

test.skip(({ browserName }) => browserName === 'webkit', 'WebKit not supported on this host');

test.describe('Escape Room API Endpoints', () => {
  test('GET /api/questions returns a list', async ({ request }) => {
    const response = await request.get(BASE_URL);
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('POST /api/questions creates a new question', async ({ request }) => {
    const payload = {
      topic: 'Playwright',
      question: 'What is Playwright?',
      hint: 'It is an end-to-end testing framework',
      answer: 'A framework for testing web apps with browsers'
    };

    const response = await request.post(BASE_URL, {
      data: payload,
      headers: { 'Content-Type': 'application/json' }
    });

    expect(response.status()).toBe(201);
    const created = await response.json();
    expect(created.topic).toBe(payload.topic);
  });

  test('PATCH /api/questions/:id updates a record', async ({ request }) => {
    // Create first
    const createRes = await request.post(BASE_URL, {
      data: {
        topic: 'UpdateTest',
        question: 'Old question',
        hint: 'Old hint',
        answer: 'Old answer'
      },
      headers: { 'Content-Type': 'application/json' }
    });

    const created = await createRes.json();
    const id = created.id;
    expect(id).toBeDefined();

    // Update it
    const updateRes = await request.patch(`${BASE_URL}/${id}`, {
      data: { hint: 'New updated hint' },
      headers: { 'Content-Type': 'application/json' }
    });

    expect(updateRes.status()).toBe(200);
  });

  test('DELETE /api/questions/:id deletes a record', async ({ request }) => {
    const createRes = await request.post(BASE_URL, {
      data: {
        topic: 'DeleteTest',
        question: 'To be deleted',
        hint: 'Temporary',
        answer: 'Delete me'
      },
      headers: { 'Content-Type': 'application/json' }
    });

    const created = await createRes.json();
    const id = created.id;
    expect(id).toBeDefined();

    const deleteRes = await request.delete(`${BASE_URL}/${id}`);
    expect(deleteRes.status()).toBe(200);
  });
});
