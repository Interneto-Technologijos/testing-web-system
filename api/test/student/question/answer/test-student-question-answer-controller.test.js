const request = require('supertest');

const app = require('../../../../app');
const db = require('../../../../db');

const PORT = 12347;

describe('Test Student Question Answer API', () => {
    const testsStudentsQuestionsApi = request(`https://localhost:${PORT}/api`);

    beforeAll(async () => {
        await app.listen(PORT, true);
        await db.connect();
    });

    afterAll(async () => {
        await app.close();
        await db.close();
    });

    beforeEach(async () => {
        await db.db().collection('tests').deleteMany();
        await db.db().collection('questions').deleteMany();
        await db.db().collection('test-student-questions').deleteMany();
    });

    describe('When test ID 1234 does not exist', () => {
        test('Then test ID NOTEXISTS can not answer question ID 1', async () => {
            const response = await testsStudentsQuestionsApi
                .post('/tests/NOTEXISTS/students/20179999/questions/1/answers')
                .expect(400)
                .expect('Content-Type', 'application/json; charset=utf-8');
            expect(response.body).toEqual(
                {
                    message: '"testId" with value "NOTEXISTS" fails to match the required pattern: /^[0-9]{4}$/',
                },
            );
        });

        test('Then student ID NOTEXISTS can not answer question ID 1', async () => {
            const response = await testsStudentsQuestionsApi
                .post('/tests/1234/students/NOTEXISTS/questions/1/answers')
                .expect(400)
                .expect('Content-Type', 'application/json; charset=utf-8');
            expect(response.body).toEqual(
                {
                    message: '"studentId" with value "NOTEXISTS" fails to match the required pattern: /^[0-9]{8}$/',
                },
            );
        });

        test('Then student ID 20179999 can not answer question ID NOTEXISTS', async () => {
            const response = await testsStudentsQuestionsApi
                .post('/tests/1234/students/20179999/questions/NOTEXISTS/answers')
                .expect(400)
                .expect('Content-Type', 'application/json; charset=utf-8');
            expect(response.body).toEqual(
                {
                    message: '"questionId" with value "NOTEXISTS" fails to match the required pattern: /^[0-9]{1,2}$/',
                },
            );
        });

        test('Then student ID 20179999 can not answer question ID 1 with index 4', async () => {
            const response = await testsStudentsQuestionsApi
                .post('/tests/1234/students/20179999/questions/1/answers')
                .set('Content-Type', 'application/json')
                .send({ answerIndex: 4 })
                .expect(400)
                .expect('Content-Type', 'application/json; charset=utf-8');
            expect(response.body).toEqual(
                {
                    message: '"answerIndex" must be less than or equal to 3',
                },
            );
        });

        test('Then student ID 20179999 can not answer question ID 1 with index -1', async () => {
            const response = await testsStudentsQuestionsApi
                .post('/tests/1234/students/20179999/questions/1/answers')
                .set('Content-Type', 'application/json')
                .send({ answerIndex: -1 })
                .expect(400)
                .expect('Content-Type', 'application/json; charset=utf-8');
            expect(response.body).toEqual(
                {
                    message: '"answerIndex" must be larger than or equal to 0',
                },
            );
        });

        test('Then student ID 20179999 can not answer question ID 1 with index NOEXISTS', async () => {
            const response = await testsStudentsQuestionsApi
                .post('/tests/1234/students/20179999/questions/1/answers')
                .set('Content-Type', 'application/json')
                .send({ answerIndex: 'NOEXISTS' })
                .expect(400)
                .expect('Content-Type', 'application/json; charset=utf-8');
            expect(response.body).toEqual(
                {
                    message: '"answerIndex" must be a number',
                },
            );
        });

        test('Then student ID 20179999 can not answer question ID 1 with index 1', async () => {
            const response = await testsStudentsQuestionsApi
                .post('/tests/1234/students/20179999/questions/1/answers')
                .set('Content-Type', 'application/json')
                .send({ answerIndex: 1 })
                .expect(400)
                .expect('Content-Type', 'application/json; charset=utf-8');
            expect(response.body).toEqual(
                {
                    message: 'Test ID 1234 does not exist'
                },
            );
        });
    });

    describe('When test ID 1234 exists and is not started', () => {

        beforeEach(async () => {
            await db.db().collection('tests').insertOne({
                _id: '1234',
                timer: 480,
            });
        });

        test('Then student ID 20179999 can not answer question ID 1 with index 1', async () => {
            const response = await testsStudentsQuestionsApi
                .post('/tests/1234/students/20179999/questions/1/answers')
                .set('Content-Type', 'application/json')
                .send({ answerIndex: 1 })
                .expect(400)
                .expect('Content-Type', 'application/json; charset=utf-8');
            expect(response.body).toEqual(
                {
                    message: 'Test ID 1234 is not started'
                },
            );
        });
    });

    describe('When test ID 1234 exists, is started and no student ID 20179999 questions are generated', () => {

        beforeEach(async () => {
            await db.db().collection('tests').insertOne({
                _id: '1234',
                timer: 480,
                startedTimestamp: new Date(),
            });
        });

        test('Then student ID 20179999 can not answer question ID 1 with index 1', async () => {
            const response = await testsStudentsQuestionsApi
                .post('/tests/1234/students/20179999/questions/1/answers')
                .set('Content-Type', 'application/json')
                .send({ answerIndex: 1 })
                .expect(400)
                .expect('Content-Type', 'application/json; charset=utf-8');
            expect(response.body).toEqual(
                {
                    message: 'Student ID 20179999 is not registered for test ID 1234'
                },
            );
        });
    });

    describe('When test ID 1234 exists, is started and student ID 20179999 questions are generated', () => {

        beforeEach(async () => {
            await db.db().collection('tests').insertOne({
                _id: '1234',
                timer: 480,
                startedTimestamp: new Date(),
            });
            await db.db().collection('test-student-questions').insertOne({
                testId: '1234',
                studentId: '20179999',
                questions: [
                    {
                        id: 1,
                        questionId: 444,
                        question: 'Kuris is siu metodu nera HTTP metodas?',
                        options: ['GET', 'POST', 'DELETE', 'REMOVE'],
                    },
                    {
                        id: 2,
                        questionId: 333,
                        question: 'Kuris is siu metodu nera HTTP metodas?',
                        options: ['GET', 'POST', 'DELETE', 'FIND'],
                    }
                ]
            });
        });

        test('Then student ID 20179999 can answer question ID 1 with anwer index 2', async () => {
            const response = await testsStudentsQuestionsApi
                .post('/tests/1234/students/20179999/questions/1/answers')
                .set('Content-Type', 'application/json')
                .send({ answerIndex: 2 })
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8');
            expect(response.body).toEqual({});
            const testStudentQuestions = await db.db().collection('test-student-questions').findOne({ testId: '1234', studentId: '20179999' });
            expect(testStudentQuestions).toEqual({
                _id: expect.anything(),
                testId: '1234',
                studentId: '20179999',
                questions: [
                    {
                        id: 1,
                        questionId: expect.anything(),
                        question: expect.stringMatching(/^.{10,}\?$/),
                        options: expect.anything(),
                        answerIndex: 2,
                    },
                    {
                        id: 2,
                        questionId: expect.anything(),
                        question: expect.stringMatching(/^.{10,}\?$/),
                        options: expect.anything(),
                    }
                ]
            });
        });
    });
});