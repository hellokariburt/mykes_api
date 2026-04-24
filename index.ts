import express from "express";
import cors from "cors";
import { api } from "./src/routes/routes.js";

import swaggerUI from "swagger-ui-express";
import swaggerSpec from "./swagger";

const app = express();
const PORT = process.env.PORT || 9999;

BigInt.prototype["toJSON"] = function () {
  return parseInt(this.toString());
};

// app.use(bodyParser.json());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from Homepage");
});

app.use(api);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT} `)
);
