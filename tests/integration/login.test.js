const dotenv = require("dotenv");
dotenv.config();

const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");

mongoose.set("strictQuery", false);

const { HOST_TEST_URI } = process.env;

describe("login", () => {
  beforeAll(async () => {
    await mongoose.connect(HOST_TEST_URI);

    // console.log("Database connection successful");
  });

  afterAll(async () => {
    await mongoose.disconnect(HOST_TEST_URI);

    // console.log("Database connection status: disconnected");
  });

  it("should log user in", async () => {
    const response = await supertest(app).post("/api/auth/login").send({
      email: "user14@mail.com",
      password: "qwerty13",
    });

    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.token).toBe(response.body.data.token);
    expect(response.body.data.user.email).toBe("user14@mail.com");
    expect(response.body.data.user.subscription).toBe(
      "starter" || "pro" || "business"
    );
    // expect(response.body.data.user.subscription).toBe(
    //   response.body.data.user.subscription
    // );
  });
});
