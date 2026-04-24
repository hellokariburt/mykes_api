import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app";

// Mock Prisma to avoid needing a live database
vi.mock("@prisma/client", () => {
  class MockPrismaClient {
    mics = {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn().mockResolvedValue(null),
      count: vi.fn().mockResolvedValue(0),
    };
    $transaction = vi.fn().mockResolvedValue([[], 0]);
  }
  return { PrismaClient: MockPrismaClient };
});

describe("GET /api/v1/mic", () => {
  it("returns 400 when id is missing", async () => {
    const res = await request(app).get("/api/v1/mic");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required/i);
  });

  it("returns 400 when id is not a valid integer", async () => {
    const res = await request(app).get("/api/v1/mic?id=abc");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/valid integer/i);
  });

  it("returns 400 when id is negative", async () => {
    const res = await request(app).get("/api/v1/mic?id=-5");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/positive/i);
  });

  it("returns 400 when id is zero", async () => {
    const res = await request(app).get("/api/v1/mic?id=0");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/positive/i);
  });

  it("returns 200 for a valid id", async () => {
    const res = await request(app).get("/api/v1/mic?id=1");
    expect(res.status).toBe(200);
  });

  it("returns 200 for a large bigint id", async () => {
    const res = await request(app).get(
      "/api/v1/mic?id=9007199254740993"
    );
    expect(res.status).toBe(200);
  });
});

describe("GET /api/v1/mics", () => {
  it("returns 200 with defaults", async () => {
    const res = await request(app).get("/api/v1/mics");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalMics");
    expect(res.body).toHaveProperty("offset", 0);
    expect(res.body).toHaveProperty("limit", 10);
  });

  it("returns 400 when limit is negative", async () => {
    const res = await request(app).get("/api/v1/mics?limit=-1");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/limit/i);
  });

  it("returns 400 when limit is zero", async () => {
    const res = await request(app).get("/api/v1/mics?limit=0");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/limit/i);
  });

  it("returns 400 when limit exceeds 100", async () => {
    const res = await request(app).get("/api/v1/mics?limit=101");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/limit/i);
  });

  it("returns 400 when offset is negative", async () => {
    const res = await request(app).get("/api/v1/mics?offset=-1");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/offset/i);
  });

  it("returns 400 when limit is not a number", async () => {
    const res = await request(app).get("/api/v1/mics?limit=abc");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/limit/i);
  });
});

describe("GET /api/v1/micTimes", () => {
  it("returns 200 with defaults", async () => {
    const res = await request(app).get("/api/v1/micTimes");
    expect(res.status).toBe(200);
  });

  it("returns 400 for malformed start-time", async () => {
    const res = await request(app).get("/api/v1/micTimes?start-time=abc");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/HH:MM:SS/);
  });

  it("returns 400 for out-of-range time values", async () => {
    const res = await request(app).get("/api/v1/micTimes?start-time=25:99:99");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/HH:MM:SS/);
  });

  it("returns 200 for valid start-time", async () => {
    const res = await request(app).get("/api/v1/micTimes?start-time=19:00:00");
    expect(res.status).toBe(200);
  });

  it("returns 400 for invalid pagination on micTimes too", async () => {
    const res = await request(app).get("/api/v1/micTimes?limit=-5");
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/limit/i);
  });
});
