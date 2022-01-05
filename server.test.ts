import supertest from "supertest";
import app from "./server";

describe("GET /users", () => {
  it("provides the list of users", async () => {
    const response = await supertest(app).get("/users");
    expect(response.body).toHaveLength(31);
  });
});
