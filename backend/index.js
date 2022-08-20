const express = require("express");
const pg = require("pg");
const LRU = require("lru-cache");
const cors = require('cors');

require("dotenv").config();

const app = express();
// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html

// Set permissive cors policy for dev build
app.use(cors({
    origin: '*'
}));

const pool = new pg.Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  user: process.env.PGUSER,
});

const queryHandler = (req, res, next) => {
  pool
    .query(req.sqlQuery)
    .then((r) => {
      return res.json(r.rows || []);
    })
    .catch(next);
};

// Caches tokens for rate limiting purposes.
// Deletes least-recently-used items which we use to set rate limit interval.
const tokenCache = new LRU({
  max: 500, // max number of tokens
  ttl: 60000, // rate limit interval (ms)
});

/** 
 * Simple rate limiter
 * Adapted from github.com/blackflux/lambda-rate-limiter, inherits same benefits/limitations.
 * 
 * Counts number of requests per client token, responds with error if request limit is exceeded. 
 * Uses lru-cache to store token:requestCount pairs.
 * Cached items have a TTL since last accessed (Default: 60s), facilitating the interval window.
 */
const rateLimit = (limitPerInterval) => {
  return function rateLimitMiddleware(req, res, next) {
    const limit = limitPerInterval || 15; // Limit per interval, default:10
    const token = req.socket.remoteAddress; // Use remote address for client tracking

    const tokenCount = tokenCache.get(token) || [0];
    if (tokenCount[0] === 0) tokenCache.set(token, tokenCount);
    tokenCount[0] += 1;

    return tokenCount[0] > limit
      ? res.status(429).send("Rate Limited, please retry later.")
      : next();
  };
};

app.get("/", rateLimit(), (req, res) => {
  res.send("Welcome to EQ Works 😎");
});

app.get(
  "/events/hourly",
  rateLimit(),
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 168;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/events/daily",
  rateLimit(),
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/stats/hourly",
  rateLimit(),
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 168;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/stats/daily",
  rateLimit(),
  (req, res, next) => {
    req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `;
    return next();
  },
  queryHandler
);

app.get(
  "/poi",
  rateLimit(),
  (req, res, next) => {
    req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `;
    return next();
  },
  queryHandler
);

app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`);
  }
});

// last resorts
process.on("uncaughtException", (err) => {
  console.log(`Caught exception: ${err}`);
  process.exit(1);
});
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  process.exit(1);
});
