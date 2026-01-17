import supertest from 'supertest';
import express from 'express';
import electricityRouter from '../routers/electricity';
import { test, describe } from 'node:test';

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use('/api/electricity', electricityRouter);

const api = supertest(app);

// needs some test data in the test database to work properly

describe('GET /api/electricity', () => {
  test('should return 200 and paginated data with valid parameters', async () => {
    // Write test here
  });

  test('should return 400 when page or pageSize is missing', async () => {
    const response = await api
      .get('/api/electricity')
      .expect(400);
  });

  test('should handle invalid query parameter types', async () => {
     // Write test here
  });

  test('should handle negative page numbers', async () => {
     // Write test here
  });
});

describe('GET /api/electricity/:date', () => {
  test('should return 200 and data for a specific date', async () => {
    // Write test here
  });
  test('should return 400 when date is missing or invalid', async () => {
    // Write test here
  });
});
