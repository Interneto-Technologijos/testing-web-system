const request = require("supertest");

const app = require("../app");
const db = require("../db");

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

  beforeEach(async () => {
    await db.db().collection("tests").deleteMany();
  });

  describe("When no tests exist", () => {
    test("Then lecturer can not create new test when no credentials are provided", async () => {
      await testsApi
        .post("/")
        .set("Content-Type", "application/json")
        .send({})
        .expect(401);
    });

    test("Then lecturer can not create new test when invalid credentials are provided", async () => {
      await testsApi
        .post("/")
        .set("Content-Type", "application/json")
        .set(
          "Authorization",
          "Basic " + new Buffer("root:pass").toString("base64")
        )
        .send({})
        .expect(401);
    });

    test("Then lecturer can not create new test when invalid password is provided", async () => {
      process.env.ADMIN_PASSWORD = "valid";
      await testsApi
        .post("/")
        .set("Content-Type", "application/json")
        .set(
          "Authorization",
          "Basic " + new Buffer("admin:invalid").toString("base64")
        )
        .send({})
        .expect(401);
    });

    test("Then lecturer can not create new test when invalid username is provided", async () => {
      process.env.ADMIN_PASSWORD = "secret";
      await testsApi
        .post("/")
        .set("Content-Type", "application/json")
        .set(
          "Authorization",
          "Basic " + new Buffer("invalid:secret").toString("base64")
        )
        .send({})
        .expect(401);
    });

    test("Then lecturer can create new test when valid credentials are provided", async () => {
      process.env.ADMIN_PASSWORD = "secret";
      const response = await testsApi
        .post("/")
        .set("Content-Type", "application/json")
        .set(
          "Authorization",
          "Basic " + new Buffer("admin:secret").toString("base64")
        )
        .send({})
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8");
      expect(response.body).toEqual({
        id: expect.stringMatching(/[0-9]{4}/),
        timer: 480,
        status: "WAITING",
      });
      const test = await db
        .db()
        .collection("tests")
        .findOne({ _id: response.body.id });
      expect(test).toEqual({
        _id: response.body.id,
        timer: 480,
      });
    });
  });

  describe("When test 1234 is created", () => {
    beforeEach(async () => {
      await db.db().collection("tests").insertOne({
        _id: "1234",
        timer: 480,
      });
    });

    test("Then student can not read test ID NOTEXISTS", async () => {
      const response = await testsApi
        .get("/NOTEXISTS")
        .expect(400)
        .expect("Content-Type", "application/json; charset=utf-8");
      expect(response.body).toEqual({
        message:
          '"id" with value "NOTEXISTS" fails to match the required pattern: /^[0-9]{4}$/',
      });
    });

    test("Then student can read test ID, timer and status", async () => {
      const response = await testsApi
        .get("/1234")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8");
      expect(response.body).toEqual({
        id: "1234",
        timer: 480,
        status: "WAITING",
      });
    });

    test("Then student can not read test ID 1111", async () => {
      const response = await testsApi
        .get("/1111")
        .expect(400)
        .expect("Content-Type", "application/json; charset=utf-8");
      expect(response.body).toEqual({
        message: "Test does not exist",
      });
    });

    test("Then lecturer can not change status for test ID NOTEXISTS", async () => {
      const response = await testsApi
        .patch("/NOTEXISTS")
        .set("Content-Type", "application/json")
        .send({ status: "IN_PROGRESS" })
        .expect(400)
        .expect("Content-Type", "application/json; charset=utf-8");
      expect(response.body).toEqual({
        message:
          '"id" with value "NOTEXISTS" fails to match the required pattern: /^[0-9]{4}$/',
      });
    });

    test("Then lecturer can not change status for not existing test ID 1111", async () => {
      const response = await testsApi
        .patch("/1111")
        .set("Content-Type", "application/json")
        .send({ status: "IN_PROGRESS" })
        .expect(400)
        .expect("Content-Type", "application/json; charset=utf-8");
      expect(response.body).toEqual({
        message: "Test does not exist",
      });
    });

    test("Then lecturer can not change status to NOTEXISTS for test ID 1234", async () => {
      const response = await testsApi
        .patch("/1234")
        .set("Content-Type", "application/json")
        .send({ status: "NOTEXISTS" })
        .expect(400)
        .expect("Content-Type", "application/json; charset=utf-8");
      expect(response.body).toEqual({
        message: '"status" must be one of [WAITING, IN_PROGRESS]',
      });
    });

    test("Then test ID 1234 can be started", async () => {
      const response = await testsApi
        .patch("/1234")
        .set("Content-Type", "application/json")
        .send({ status: "IN_PROGRESS" })
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8");
      expect(response.body).toEqual({
        id: "1234",
        timer: 480,
        status: "IN_PROGRESS",
        startedTimestamp: expect.stringMatching(
          /[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}.*/
        ),
      });
      const test = await db.db().collection("tests").findOne({ _id: "1234" });
      expect(test).toEqual({
        _id: response.body.id,
        timer: 480,
        startedTimestamp: new Date(response.body.startedTimestamp),
      });
    });
  });

  describe("When test 1234 is started", () => {
    beforeEach(async () => {
      await db.db().collection("tests").insertOne({
        _id: "1234",
        timer: 480,
        startedTimestamp: new Date(),
      });
    });

    test("Then student can read test ID, timer and status", async () => {
      const response = await testsApi
        .get("/1234")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8");
      expect(response.body).toEqual({
        id: "1234",
        timer: 480,
        status: "IN_PROGRESS",
      });
    });
  });
});
