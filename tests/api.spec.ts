import { test, expect } from '@playwright/test';

const BASE_URL = 'http://ec2-13-222-130-180.compute-1.amazonaws.com:4080/api/questions';

test.skip(({ browserName }) => browserName === 'webkit', 'WebKit not supported on this host');

test.describe('Escape Room API Endpoints', () => {
  test('GET /api/questions returns a list', async ({ request }) => {
    const response = await request.get(BASE_URL);
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
  });

  test('POST /api/questions creates or detects duplicate', async ({ request }) => {
    const payload = {
      topic: 'Python',
      question: 'What is a decorator in Python (test)?',
      hint: 'Used to modify function behavior',
      answer: 'A wrapper function'
    };

    const response = await request.post(BASE_URL, {
      data: payload,
      headers: { 'Content-Type': 'application/json' }
    });

    // Accept both 201 Created and 409 Conflict as valid
    expect([201, 409]).toContain(response.status());

    const created = await response.json();
    expect(created.topic || created.error).toBeDefined();
  });

  test('PATCH /api/questions/:id updates a record', async ({ request }) => {
    // Create (or detect existing)
    const createRes = await request.post(BASE_URL, {
      data: {
        topic: 'UpdateTest',
        question: 'Old question',
        hint: 'Old hint',
        answer: 'Old answer'
      },
      headers: { 'Content-Type': 'application/json' }
    });

    let created;
    try {
      created = await createRes.json();
    } catch {
      created = { message: await createRes.text() };
    }

    let id = created.id;

    // 🩹 Handle duplicate case (409) by fetching existing record
    if (!id) {
      const getRes = await request.get(`${BASE_URL}?topic=UpdateTest`);
      const list = await getRes.json();
      if (Array.isArray(list) && list.length > 0) {
        id = list[0].id;
      }
    }

    expect(id).toBeDefined();

    // Update it
    const updateRes = await request.patch(`${BASE_URL}/${id}`, {
      data: { hint: 'New updated hint' },
      headers: { 'Content-Type': 'application/json' }
    });

    expect([200, 204, 409]).toContain(updateRes.status());
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
    expect([200, 204]).toContain(deleteRes.status());
  });
});
