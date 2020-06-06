const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const user1 = {
    first_name: "Mike",
    last_name: "Johnson",
    email: "Mike@aol.com",
    password: "43my_pass!"
}

const user2 = {
    first_name: "Thomas",
    last_name: "White",
    email: "tomwhite@comcast.net",
    password: "foobarbinbaz"
}

let token1;

beforeAll(async () => {
    await User.deleteMany();
    await new User(user1).save();
    await new User(user2).save();

    const res1 = await request(app).post("/users/login").send({
        email: user1.email,
        password: user1.password
    });
    token1 = res1.headers["set-cookie"][0].replace("access_token=", "");
    token1 = token1.slice(0, token1.indexOf(";"));
});

test("Should register a new user", async () => {
    await request(app).post("/users").send({
        first_name: "Foo",
        last_name: "Bar",
        email: "foo@bar.com",
        password: "test_!pass!_555"
    }).expect(201);
});

test("Should not register a new user with an email in use", async () => {
    await request(app).post("/users").send({
        first_name: "Foo",
        last_name: "Bar",
        email: "mike@aol.com",
        password: "test_!pass!_555"
    }).expect(400);
});

test("Should hash a user's password upon registration", async () => {
    await request(app).post("/users").send({
        first_name: "Bin",
        last_name: "Baz",
        email: "bin@baz.com",
        password: "test_!pass!_555"
    }).expect(201);

    const user = await User.findOne({ email: "bin@baz.com" });
    expect(user.password).not.toBe("test_!pass!_555")
});

test("Should login an existing user", async () => {
    await request(app).post("/users/login").send({
        email: user1.email,
        password: user1.password
    }).expect(202);
});

test("Should not login a non-existing user", async () => {
    await request(app).post("/users/login").send({
        email: user1.email + "foo",
        password: user1.password
    }).expect(400);
});

test("Should not login an existing user with the wrong PW", async () => {
    await request(app).post("/users/login").send({
        email: user1.email,
        password: user1.password + "foo"
    }).expect(400);
});

/////////////////////////////////

test("Should not let an unauthenticated user post to logout", async () => {
    await request(app)
        .post("/users/logout")
        .send()
        .expect(401);
});

test("Should log a user out", async () => {
    await request(app)
        .post("/users/logout")
        .set("Cookie", [`access_token=${token1}`])
        .send()
        .expect(202);
});

test("Should get profile for authenticated user", async () => {
    const res = await request(app)
        .get("/users/me")
        .set("Cookie", [`access_token=${token1}`])
        .send()
        .expect(200);

    expect(res.text).toContain(user1.first_name);
    expect(res.text).toContain(user1.last_name);
    expect(res.text).toContain(user1.email.toLowerCase());
});

test("Should not get profile for unauthenticated user", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401);
});

test("Should update profile for authenticated user", async () => {
    const res = await request(app)
        .patch("/users/me")
        .set("Cookie", [`access_token=${token1}`])
        .send({
            first_name: "Sally",
            last_name: "Green",
            email: "sallyg@compuserve.com",
            phone: "555-555-5555",
            password: "a_new_pass"
        })
        .expect(202);

    expect(res.text).toContain("Sally");
    expect(res.text).toContain("Green");
    expect(res.text).toContain("sallyg@compuserve.com");
    expect(res.text).toContain("555-555-5555");
});

test("Should not update profile for unauthenticated user", async () => {
    const res = await request(app)
        .patch("/users/me")
        .send({
            first_name: "Sally",
            last_name: "Green",
            email: "sallyg@compuserve.com",
            phone: "555-555-5555",
            password: "a_new_pass"
        })
        .expect(401);
});

test("Should hash a user's updated password", async () => {
    await request(app)
        .patch("/users/me")
        .set("Cookie", [`access_token=${token1}`])
        .send({
            password: "a_new_pass"
        })
        .expect(202);

    const user = await User.findOne({ email: "sallyg@compuserve.com" });
    expect(user.password).not.toBe("a_new_pass");
});

test("Should delete an authenticated user's account", async () => {
    await request(app)
        .delete("/users/me")
        .set("Cookie", [`access_token=${token1}`])
        .send()
        .expect(202);

    const user = await User.findOne({ email: "mike@aol.com" });
    expect(user).toBeNull();
});

test("Should not delete an unauthenticated user's account", async () => {
    await request(app)
        .delete("/users/me")
        .send()
        .expect(401);
});
