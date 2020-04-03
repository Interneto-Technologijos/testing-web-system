const request = require('supertest');

const app = require('../../../app');
const db = require('../../../db');

const PORT = 12345;

describe('Test Student Question API', () => {
    const testsStudentsQuestionsApi = request(`http://localhost:${PORT}/api`);

    beforeAll(async () => {
        await app.listen(PORT);
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

    describe('When there is a test ID 1234 started with 4 quesions', () => {

        beforeEach(async () => {
            await db.db().collection('tests').insertOne({
                _id: '1234',
                timer: 480,
            });
            await db.db().collection('questions').insertMany([
                {
                    question: 'Kuris is siu metodu nera HTTP metodas?',
                    incorrectOptions: ['GET', 'POST', 'PUT'],
                    corectOption: 'REMOVE',
                },
                {
                    question: 'Kuris is siu metodu nera HTTP metodas?',
                    incorrectOptions: ['GET', 'POST', 'PUT'],
                    corectOption: 'FIND',
                },
                {
                    question: 'Kuris is siu metodu nera HTTP metodas?',
                    incorrectOptions: ['GET', 'POST', 'PUT'],
                    corectOption: 'SAVE',
                },
                {
                    question: 'Kuris is siu metodu nera HTTP metodas?',
                    incorrectOptions: ['GET', 'POST', 'PUT'],
                    corectOption: 'EDIT',
                }
            ]);
        });

        test('Then student ID 20179999 can get his generated test questions', async () => {
            const response = await testsStudentsQuestionsApi
                .get('/tests/1234/students/20179999/questions')
                .expect(200)
                .expect('Content-Type', 'application/json; charset=utf-8');
            expect(response.body).toEqual([
                {
                    id: 1,
                    question: expect.stringMatching(/^.{10,}\?$/),
                    options: expect.anything(),
                },
                {
                    id: 2,
                    question: expect.stringMatching(/^.{10,}\?$/),
                    options: expect.anything(),
                }
            ]);
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

        describe('Test ID 1234 student 20179999 questions exists', () => {

            beforeEach(async () => {
                await db.db().collection('test-student-questions').insertOne({
                    testId: '1234',
                    studentId: '20179999',
                    questions: [
                        {
                            id: 1,
                            question: 'Kuris is siu metodu nera HTTP metodas?',
                            options: ['GET', 'POST', 'PUT', 'REMOVE'],
                        },
                        {
                            id: 2,
                            question: 'Kuris is siu metodu nera HTTP metodas?',
                            options: ['GET', 'POST', 'PUT', 'FIND'],
                        }
                    ]
                });
            });

            test('Then student ID 20179999 can get his test questions', async () => {
                const response = await testsStudentsQuestionsApi
                    .get('/tests/1234/students/20179999/questions')
                    .expect(200)
                    .expect('Content-Type', 'application/json; charset=utf-8');
                expect(response.body).toEqual([
                    {
                        id: 1,
                        question: 'Kuris is siu metodu nera HTTP metodas?',
                        options: ['GET', 'POST', 'PUT', 'REMOVE'],
                    },
                    {
                        id: 2,
                        question: 'Kuris is siu metodu nera HTTP metodas?',
                        options: ['GET', 'POST', 'PUT', 'FIND'],
                    }
                ]);
            });
        });
    });
});