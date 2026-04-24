import express, { Request } from "express";
import { getMics, getMic } from "../services/mics.service";
import { MicQueryParams, ALL_BOROUGHS, ALL_DAYS } from "../types";

const router = express.Router();

const parseParams = (req: Request): MicQueryParams => {
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

  return {
    day: dayArray,
    borough: boroughArray,
    limit: Number(req.query.limit) || 10,
    offset: Number(req.query.offset) || 0,
    start_time: (req.query["start-time"] as string) || "00:00:00",
    cost: (req.query.free as string) || "false",
  };
};

const micsController = router.get("/mics", async (req, res, next) => {
  try {
    const params = parseParams(req);
    const { mics, count } = await getMics(params);
    res.status(200).json({
      totalMics: count,
      offset: params.offset,
      limit: params.limit,
      mics,
    });
  } catch (error) {
    next(error);
  }
});

const micController = router.get("/mic", async (req, res, next) => {
  try {
    const id = Number(req.query.id);
    const mic = await getMic(id);
    res.status(200).json({ mic });
  } catch (error) {
    next(error);
  }
});

const micTimesController = router.get("/micTimes", async (req, res, next) => {
  try {
    const params = parseParams(req);
    const { mics, count } = await getMics(params);
    res.status(200).json({
      totalMics: count,
      offset: params.offset,
      limit: params.limit,
      mics,
    });
  } catch (error) {
    next(error);
  }
});

export { micController, micsController, micTimesController };
