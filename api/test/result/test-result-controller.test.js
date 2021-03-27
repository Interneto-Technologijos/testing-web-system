const request = require("supertest");
const { ObjectId } = require("mongodb");

const app = require("../../app");
const db = require("../../db");

const PORT = 12345;

describe("Test Result API", () => {
  const testsApi = request(`http://localhost:${PORT}/api/tests`);

  beforeAll(async () => {
    await app.listen(PORT);
    await db.connect();
  });

  afterAll(async () => {
    await app.close();
    await db.close();
  });

  beforeEach(async () => {
    await db.db().collection("tests").deleteMany();
  });

  describe("When no tests exist", () => {
    test("Then lecturer can not get invalid test result", async () => {
      const response = await testsApi.get("/NOTEXISTS/results").expect(400);
      expect(response.body).toEqual({
        message:
          '"testId" with value "NOTEXISTS" fails to match the required pattern: /^[0-9]{4}$/',
      });
    });
    test("Then lecturer can not get not existing test result", async () => {
      const response = await testsApi.get("/1234/results").expect(400);
      expect(response.body).toEqual({
        message: "Test does not exist",
      });
    });
  });

  describe("When there is a test ID 1234 with 2 quesions and 2 test student questions", () => {
    beforeEach(async () => {
      await db
        .db()
        .collection("questions")
        .insertMany([
          {
            _id: ObjectId("604b119bb63e89ec953d76e0"),
            corectOption: "REMOVE",
          },
          {
            _id: ObjectId("604b119bb63e89ec953d76e1"),
            corectOption: "FIND",
          },
        ]);
      await db
        .db()
        .collection("test-student-questions")
        .insertMany([
          {
            _id: ObjectId("604b119bb63e89ec953d76ed"),
            testId: "6372",
            studentId: "12345678",
            questions: [
              {
                questionId: ObjectId("604b119bb63e89ec953d76e0"),
                options: ["GET", "POST", "REMOVE", "DELETE"],
                answerIndex: 2,
              },
              {
                questionId: ObjectId("604b119bb63e89ec953d76e1"),
                options: ["FIND", "POST", "GET", "DELETE"],
                answerIndex: 0,
              },
            ],
          },
          {
            _id: ObjectId("604b119bb63e89ec953d76ef"),
            testId: "6372",
            studentId: "87654321",
            questions: [
              {
                questionId: ObjectId("604b119bb63e89ec953d76e0"),
                options: ["GET", "POST", "REMOVE", "DELETE"],
                answerIndex: 1,
              },
              {
                questionId: ObjectId("604b119bb63e89ec953d76e1"),
                options: ["FIND", "POST", "GET", "DELETE"],
                answerIndex: 0,
              },
            ],
          },
        ]);
    });

    test("Then lecturer can get test results", async () => {
      const response = await testsApi.get("/6372/results").expect(200);
      expect(response.body).toEqual([
        { studentId: "12345678", mark: "0.2" },
        { studentId: "87654321", mark: "0.1" },
      ]);
    });
  });
});
