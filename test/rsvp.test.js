const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const RSVP = require("../src/models/rsvp");

const rsvp1 = {
    author: "Mike Johnson",
    author_email: "mjohnson@comcast.net",
    author_phone: "555-555-5555",
    title: "Test title",
    description: "Test description",
    location: "Some place",
    date: "10/10/2021",
    time: "17:30",
    end_time: "20:00",
    expire: false,
    img: "",
    pin: "",
};

const rsvp2 = {
    author: "Thomas White",
    author_email: "tomwhite@comcast.net",
    author_phone: "333-333-3333",
    title: "Other test title",
    description: "Other test description",
    location: "Some other place",
    date: "12/12/2022",
    time: "13:30",
    end_time: "14:30",
    expire: false,
    img: "",
    pin: "",
};

const user1 = {
    first_name: "Mike",
    last_name: "Johnson",
    phone: "555-555-5555",
    email: "Mike@aol.com",
    password: "43my_pass!"
};

const user2 = {
    first_name: "Thomas",
    last_name: "White",
    phone: "333-333-3333",
    email: "tomwhite@comcast.net",
    password: "foobarbinbaz"
};

let token1;
let token2;

beforeAll(async () => {
    await User.deleteMany();
    await RSVP.deleteMany();
    await new User(user1).save();
    await new User(user2).save();

    const res1 = await request(app).post("/users/login").send({
        email: user1.email,
        password: user1.password
    });
    token1 = res1.headers["set-cookie"][0].replace("access_token=", "");
    token1 = token1.slice(0, token1.indexOf(";"));

    const res2 = await request(app).post("/users/login").send({
        email: user2.email,
        password: user2.password
    });
    token2 = res2.headers["set-cookie"][0].replace("access_token=", "");
    token2 = token2.slice(0, token2.indexOf(";"));

    await request(app)
        .post("/rsvp")
        .set("Cookie", [`access_token=${token2}`])
        .send(rsvp2)

    const rsvp = await RSVP.findOne({ author_email: rsvp2.author_email });
    rsvp2.id = rsvp.id;
});

test("Should not render new RSVP page to unauthenticated user", async () => {
    await request(app).get("/rsvp").send().expect(302);
});

test("Should render new RSVP page to authenticated user", async () => {
    await request(app)
        .get("/rsvp")
        .set("Cookie", [`access_token=${token1}`])
        .send()
        .expect(200);
});

test("Should render new RSVP with prepopulated data", async () => {
    const res = await request(app)
        .get("/rsvp")
        .set("Cookie", [`access_token=${token1}`])
        .send()
        .expect(200);

    expect(res.text).toContain(`${user1.first_name} ${user1.last_name}`);
    expect(res.text).toContain(user1.email.toLowerCase());
    expect(res.text).toContain(user1.phone);
});

test("Should not create a new RSVP for unauthenticated user", async () => {
    await request(app)
        .post("/rsvp")
        .send()
        .expect(302);
});

test("Should not create a new RSVP with missing fields", async () => {
    const rsvp = JSON.parse(JSON.stringify(rsvp1));
    delete rsvp.title;

    await request(app)
        .post("/rsvp")
        .set("Cookie", [`access_token=${token1}`])
        .send(rsvp)
        .expect(400);
});

test("Should not create a new RSVP with a date that's already passed.", async () => {
    const rsvp = JSON.parse(JSON.stringify(rsvp1));
    rsvp.date = new Date(Date.now());
    rsvp.date.setUTCHours(0);
    rsvp.date.setUTCMinutes(0);
    rsvp.date.setUTCSeconds(0);
    rsvp.date.setUTCMilliseconds(0);
    rsvp.date.setDate(rsvp.date.getDate() - 1);

    await request(app)
        .post("/rsvp")
        .set("Cookie", [`access_token=${token1}`])
        .send(rsvp)
        .expect(400);
});

test("Should create a new RSVP", async () => {
    await request(app)
        .post("/rsvp")
        .set("Cookie", [`access_token=${token1}`])
        .send(rsvp1);

    const rsvp = await RSVP.findOne({ author_email: rsvp1.author_email });
    expect(rsvp).toBeDefined();
    expect(rsvp.qr).toBeDefined();
    expect(rsvp.id).toBeDefined();
});

test("Should render the public RSVP page", async () => {
    const res = await request(app)
        .get(`/rsvp/${rsvp2.id}`)
        .send()
        .expect(200);

    expect(res.text).toContain(rsvp2.title);
    expect(res.text).toContain(rsvp2.author);
});

test("Should render the private RSVP guest-list for RSVP owner", async () => {
    await request(app)
        .get(`/rsvp/${rsvp2.id}/joined`)
        .set("Cookie", [`access_token=${token2}`])
        .send()
        .expect(200);
});

test("Should not render the private RSVP guest-list for non-RSVP owner", async () => {
    await request(app)
        .get(`/rsvp/${rsvp2.id}/joined`)
        .set("Cookie", [`access_token=${token1}`])
        .send()
        .expect(404);
});

test("Should render the QR for RSVP", async () => {
    const res = await request(app)
        .get(`/rsvp/${rsvp2.id}/qr`)
        .send()
        .expect(200);

    expect(res.text).toContain("data:image/png;base64");
});

test("Should render the image for RSVP", async () => {
    const res = await request(app)
        .get(`/rsvp/${rsvp2.id}/img`)
        .send()
        .expect(200);

    expect(res.body).toEqual(expect.any(Buffer));
});

test("Should not render the edit page for non-owner of RSVP", async () => {
    await request(app)
        .get(`/rsvp/${rsvp2.id}/edit`)
        .set("Cookie", [`access_token=${token1}`])
        .send()
        .expect(404);
});

test("Should render the edit page for owner of RSVP", async () => {
    await request(app)
        .get(`/rsvp/${rsvp2.id}/edit`)
        .set("Cookie", [`access_token=${token2}`])
        .send()
        .expect(200);
});

