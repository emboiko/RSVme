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
    date: "10/10/2022",
    rsvp_by: "10/5/2022",
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
    rsvp_by: "10/5/2022",
    time: "13:30",
    end_time: "14:30",
    expire: false,
    img: "",
    pin: "",
};

let rsvp3;

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
    rsvp1.id = rsvp.id;
});

test("Should create a new RSVP with an image", async () => {
    const rsvp_ = JSON.parse(JSON.stringify(rsvp1));
    rsvp_.author_email = "test@test.com"
    await request(app)
        .post("/rsvp")
        .set("Cookie", [`access_token=${token1}`])
        .attach("rsvp-img", "test/fixtures/hay.png")
        .field(rsvp_);

    const rsvp = await RSVP.findOne({ author_email: "test@test.com" });
    expect(rsvp).toBeDefined();
    expect(rsvp.qr).toBeDefined();
    expect(rsvp.id).toBeDefined();
    rsvp3 = rsvp;
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

test("Should not update RSVP for unauthenticated user", async () => {
    await request(app)
        .patch(`/rsvp/${rsvp2.id}`)
        .send({ title: "New RSVP title" })
        .expect(302);
});

test("Should not update RSVP with invalid data", async () => {
    await request(app)
        .patch(`/rsvp/${rsvp2.id}`)
        .set("Cookie", [`access_token=${token2}`])
        .send({ qr: "Foo" })
        .expect(400);
});

test("Should not update RSVP without required fields", async () => {
    const rsvp = JSON.parse(JSON.stringify(rsvp2));
    delete rsvp.title;
    await request(app)
        .patch(`/rsvp/${rsvp2.id}`)
        .set("Cookie", [`access_token=${token2}`])
        .send(rsvp)
        .expect(400);
});

test("Should not render the delete page for non-owner of RSVP", async () => {
    await request(app)
        .get(`/rsvp/${rsvp2.id}/delete`)
        .set("Cookie", [`access_token=${token1}`])
        .send()
        .expect(404);
});

test("Should render the delete page for owner of RSVP", async () => {
    const res = await request(app)
        .get(`/rsvp/${rsvp2.id}/delete`)
        .set("Cookie", [`access_token=${token2}`])
        .send()
        .expect(200);

    expect(res.text).toContain(rsvp2.title);
});

test("Should not delete RSVP for non-owner", async () => {
    await request(app)
        .delete(`/rsvp/${rsvp2.id}`)
        .set("Cookie", [`access_token=${token1}`])
        .send()
        .expect(404);
});

test("Should delete RSVP for owner", async () => {
    await request(app)
        .delete(`/rsvp/${rsvp2.id}`)
        .set("Cookie", [`access_token=${token2}`])
        .send()
        .expect(302);
});

test("Should render the rsvp-list page for authenticated user", async () => {
    const res = await request(app)
        .get("/rsvps")
        .set("Cookie", [`access_token=${token2}`])
        .send()
        .expect(200);

    expect(res.text).toContain("My RSVPs");
});

test("Should not allow an RSVP to be accepted without email", async () => {
    await request(app)
        .post(`/rsvp/${rsvp1.id}`)
        .send({
            party: "The Johnsons",
            party_size: "5",
            accepted: "Accept"
        })
        .expect(400);
});

test("Should not allow an RSVP to be accepted without pin [if set]", async () => {
    const rsvp = await RSVP.findOne({ id: rsvp1.id });
    rsvp.pin = "JOINUS2020"
    await rsvp.save();

    await request(app)
        .post(`/rsvp/${rsvp1.id}`)
        .send({
            party: "The Johnsons",
            party_size: "5",
            email: "johnsonfamily@gmail.com",
            accepted: "Accept"
        })
        .expect(400);
});

test("Should allow an RSVP to be accepted", async () => {
    await request(app)
        .post(`/rsvp/${rsvp1.id}`)
        .send({
            party: "The Johnsons",
            party_size: "5",
            email: "johnsonfamily@gmail.com",
            pin: "JOINUS2020",
            accepted: "Accept"
        })
        .expect(201);

    const rsvp = await RSVP.findOne({ id: rsvp1.id });
    expect(rsvp.joined.length).toBe(1);
    expect(rsvp.num_guests).toBe(5);
});

test("Should allow an RSVP to be accepted without pin", async () => {
    await request(app)
        .post(`/rsvp/${rsvp3.id}`)
        .send({
            party: "The Johnsons",
            party_size: "5",
            email: "johnsonfamily@gmail.com",
            accepted: "Accept"
        })
        .expect(201);

    const rsvp = await RSVP.findOne({ id: rsvp3.id });
    expect(rsvp.joined.length).toBe(1);
    expect(rsvp.num_guests).toBe(5);
});

test("Should not allow an RSVP to be accepted twice with the same email", async () => {
    await request(app)
        .post(`/rsvp/${rsvp1.id}`)
        .send({
            party: "The Johnsons",
            party_size: "5",
            email: "johnsonfamily@gmail.com",
            pin: "JOINUS2020",
            accepted: "Accept"
        })
        .expect(400);

    const rsvp = await RSVP.findOne({ id: rsvp1.id });
    expect(rsvp.joined.length).toBe(1);
    expect(rsvp.num_guests).toBe(5);
});

test("Should allow an RSVP to be declined", async () => {
    await request(app)
        .post(`/rsvp/${rsvp1.id}`)
        .send({
            party: "Steve",
            party_size: "1",
            email: "steve@gmail.com",
            pin: "JOINUS2020",
            accepted: "Decline"
        })
        .expect(201);

    const rsvp = await RSVP.findOne({ id: rsvp1.id });
    expect(rsvp.joined.length).toBe(1);
    expect(rsvp.num_guests).toBe(5);
    expect(rsvp.declined.length).toBe(1);
});

test("Should render the guest-list for RSVP owner [with guests]", async () => {
    const res = await request(app)
        .get(`/rsvp/${rsvp1.id}/joined`)
        .set("Cookie", [`access_token=${token1}`])
        .send()
        .expect(200);

    expect(res.text).toContain("The Johnsons");
    expect(res.text).toContain("johnsonfamily@gmail.com");
});