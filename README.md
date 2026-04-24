# OpenMYC API

**Locate the Laughs** -- All the comedy open mic info in the New York City five boroughs, accessible through a RESTful API.

Built with Express, TypeScript, Prisma, and PostgreSQL.

## Endpoints

All endpoints are under `/api/v1/`.

### Get all mics

`GET /api/v1/mics`

| Parameter    | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| `borough`   | string | Comma-separated list or `all`. Values: `manhattan`, `queens`, `bronx`, `brooklyn`, `staten-island` |
| `day`       | string | Comma-separated list or `all`. Values: `sunday` through `saturday` |
| `free`      | string | Set to `true` to filter for free mics only       |
| `limit`     | number | Results per page (default: 10)                   |
| `offset`    | number | Number of results to skip (default: 0)           |

### Get mics by start time

`GET /api/v1/micTimes`

Same parameters as `/mics`, plus:

| Parameter    | Type   | Description                                      |
|-------------|--------|--------------------------------------------------|
| `start-time`| string | Filter mics starting at or after this time (e.g. `19:00:00`) |

### Get a single mic

`GET /api/v1/mic?id={id}`

| Parameter | Type   | Description       |
|----------|--------|-------------------|
| `id`     | number | Mic ID (required) |

## API Documentation

Swagger UI is available at `/api-docs` when the server is running.

## Development

```bash
npm install
npm run dev
```

Requires `DATABASE_URL` in your environment (Prisma/PostgreSQL).
