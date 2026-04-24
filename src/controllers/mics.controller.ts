import express, { Request, Response } from "express";
import { getMics, getMic } from "../services/mics.service";
import { MicQueryParams, ALL_BOROUGHS, ALL_DAYS, TIME_FORMAT } from "../types";

const router = express.Router();

const parseParams = (req: Request): MicQueryParams | string => {
  const borough = req.query.borough as string | undefined;
  let boroughArray = borough ? borough.split(",") : [];
  if (borough === "all") {
    boroughArray = [...ALL_BOROUGHS];
  }

  const day = req.query.day as string | undefined;
  let dayArray = day ? day.split(",") : [];
  if (day === "all") {
    dayArray = [...ALL_DAYS];
  }

  const rawLimit = req.query.limit;
  const limit = rawLimit !== undefined ? Number(rawLimit) : 10;
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return "limit must be an integer between 1 and 100";
  }

  const rawOffset = req.query.offset;
  const offset = rawOffset !== undefined ? Number(rawOffset) : 0;
  if (!Number.isInteger(offset) || offset < 0) {
    return "offset must be a non-negative integer";
  }

  const startTime = (req.query["start-time"] as string) || "00:00:00";
  if (!TIME_FORMAT.test(startTime)) {
    return "start-time must be in HH:MM:SS format (e.g. 19:00:00)";
  }

  return {
    day: dayArray,
    borough: boroughArray,
    limit,
    offset,
    start_time: startTime,
    cost: (req.query.free as string) || "false",
  };
};

const sendPaginatedResponse = (
  res: Response,
  params: MicQueryParams,
  mics: unknown[],
  count: number
) => {
  res.status(200).json({
    totalMics: count,
    offset: params.offset,
    limit: params.limit,
    mics,
  });
};

const micsController = router.get("/mics", async (req, res, next) => {
  try {
    const params = parseParams(req);
    if (typeof params === "string") {
      res.status(400).json({ error: params });
      return;
    }
    const { mics, count } = await getMics(params);
    sendPaginatedResponse(res, params, mics, count);
  } catch (error) {
    next(error);
  }
});

const micController = router.get("/mic", async (req, res, next) => {
  try {
    const rawId = req.query.id as string | undefined;
    if (!rawId) {
      res.status(400).json({ error: "id query parameter is required" });
      return;
    }
    let id: bigint;
    try {
      id = BigInt(rawId);
    } catch {
      res.status(400).json({ error: "id must be a valid integer" });
      return;
    }
    if (id <= 0n) {
      res.status(400).json({ error: "id must be a positive integer" });
      return;
    }
    const mic = await getMic(id);
    res.status(200).json({ mic });
  } catch (error) {
    next(error);
  }
});

const micTimesController = router.get("/micTimes", async (req, res, next) => {
  try {
    const params = parseParams(req);
    if (typeof params === "string") {
      res.status(400).json({ error: params });
      return;
    }
    const { mics, count } = await getMics(params);
    sendPaginatedResponse(res, params, mics, count);
  } catch (error) {
    next(error);
  }
});

export { micController, micsController, micTimesController };
