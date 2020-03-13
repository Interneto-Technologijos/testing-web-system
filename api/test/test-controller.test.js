const request = require('supertest');

const app = require('../app');
const db = require('../db');

const PORT = 12345;

describe("Test API", () => {
    const testsApi = request(`http://localhost:${PORT}/api/tests`);

    beforeAll(async () => {
        await app.listen(PORT);
        await db.connect();
    });

    afterAll(async () => {
        await app.close();
        await db.close();
    });

    describe("When I create new test", () => {
        test("Then test ID and timer is provided", async () => {
            const response = await testsApi
                .post('/')
                .set('Content-Type', 'application/json')
                .send({})
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8');
            expect(response.body).toEqual({
                id: expect.stringMatching(/[0-9]{4}/),
                timer: 480,
            });
            const test = await db.db().collection('tests').findOne({ _id: response.body.id });
            expect(test).toEqual({
                _id: response.body.id,
                timer: 480,
            });
        });
    });
});