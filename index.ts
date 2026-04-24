import app from "./app";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Exiting.");
  process.exit(1);
}

const PORT = process.env.PORT || 9999;

app.listen(PORT, () =>
  console.log(`Server running on port: http://localhost:${PORT}`)
);
