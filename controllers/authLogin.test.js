const mongoose = require("mongoose");
const {
    beforeAll,
    afterAll,
    describe,
    expect,
    test,
} = require("@jest/globals");
const app = require("../app");
const request = require("supertest");
require("dotenv").config();

mongoose.set("strictQuery", false);

const DB_HOST = process.env.DB_HOST;

describe("Register/Login controller", () => {
    beforeAll(async () => {
        await mongoose.connect(DB_HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    const user = {
        email: "user666@mail.ua",
        password: "qwerty",
    };

    test("It should create new user", async () => {
        const regResponse = await request(app)
            .post("/users/registration")
            .send(user);
        expect(regResponse.status).toBe(201);
        expect(regResponse.body).toBeInstanceOf(Object);
        expect(regResponse.body.user).toBeInstanceOf(Object);
        expect(typeof regResponse.body.user.email).toBe("string");
        expect(typeof regResponse.body.user.subscription).toBe("string");
    });

    test("It should login user and return token", async () => {
        const logResponse = await request(app).post("/users/login").send(user);
        expect(logResponse.status).toBe(200);
        expect(logResponse.body.token).toBeTruthy();
        expect(logResponse.body.user).toBeInstanceOf(Object);
        expect(typeof logResponse.body.user.email).toBe("string");
        expect(typeof logResponse.body.user.subscription).toBe("string");
    });

    test("It should delete test user", async () => {
        const delResponce = await request(app).delete(
            "/users?email=" + user.email,
        );
        expect(delResponce.status).toBe(200);
    });

    afterAll(async () => {
        await mongoose.disconnect("done");
    });
});
