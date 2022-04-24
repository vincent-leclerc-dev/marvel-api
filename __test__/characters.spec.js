const supertest = require('supertest');
const app = require('../bin/www');

afterAll(async (done) => {
  await app.close(done);
});

describe("Testing the Marvel API", () => {
  it("test characters endpoint", async (done) => {
    const response = await supertest(app).get('/characters');
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('offset');
    expect(response.body.data).toHaveProperty('limit');
    expect(response.body.data).toHaveProperty('total');
    expect(response.body.data).toHaveProperty('count');
    expect(response.body.data).toHaveProperty('results');
    done();
  });
});

