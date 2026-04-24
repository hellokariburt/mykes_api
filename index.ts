import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { api } from "./src/routes/routes.js";

import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./swagger";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Exiting.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 9999;

BigInt.prototype["toJSON"] = function () {
  const value = this.toString();
  if (BigInt(value) > BigInt(Number.MAX_SAFE_INTEGER)) {
    return value;
  }
  return Number(value);
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (_req, res) => {
  res.send("Hello from Homepage");
});

app.use(api);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
