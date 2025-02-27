const request = require("supertest");
const app = require("../index");
const pool = require('../config/db');

describe("Task API endpoints", () => {
  let taskId;

  // Test task creation
  it("should create a new task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Test Task", description: "Jest api testing description" });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("id");
    taskId = res.body.id;
  });

  // Test fetching recent tasks
  it("should retrieve recent tasks", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  // Test marking task as completed
  it("should mark a task as completed", async () => {
    const res = await request(app)
      .patch(`/tasks/${taskId}/done`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "Task marked as done");
  });


afterAll(async () => {
    // Close mysql connection
    await pool.end();
  });
});
