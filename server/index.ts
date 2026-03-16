import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import helmet from "helmet";
import crypto from "crypto";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
app.set("trust proxy", 1);
const httpServer = createServer(app);

app.use(compression());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://static.line-scdn.net", "https://liff.line.me"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "blob:", "https:", "http:"],
      connectSrc: ["'self'", "https://api.line.me", "https://liff.line.me", "https://api.unsplash.com", "https://maps.googleapis.com", "wss:", "ws:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      frameSrc: ["'self'", "https://liff.line.me"],
      frameAncestors: ["'self'", "https://liff.line.me", "https://access.line.me"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));

app.use((req, res, next) => {
  const requestId = crypto.randomBytes(8).toString("hex");
  (req as any).requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  next();
});

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: "1mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: "1mb" }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

const latencyBuckets: number[] = [];
const MAX_LATENCY_SAMPLES = 1000;

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const requestId = (req as any).requestId || "-";
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      latencyBuckets.push(duration);
      if (latencyBuckets.length > MAX_LATENCY_SAMPLES) latencyBuckets.shift();

      let logLine = `[${requestId}] ${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        const body = JSON.stringify(capturedJsonResponse);
        logLine += ` :: ${body.length > 500 ? body.slice(0, 500) + "…" : body}`;
      }

      if (duration > 2000) {
        logLine = `[SLOW] ${logLine}`;
      }

      log(logLine);
    }
  });

  next();
});

app.get("/api/health", (_req, res) => {
  const sorted = [...latencyBuckets].sort((a, b) => a - b);
  const p = (pct: number) => sorted[Math.floor(sorted.length * pct / 100)] || 0;
  res.json({
    status: "ok",
    uptime: process.uptime(),
    memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    latency: sorted.length > 0 ? { p50: p(50), p95: p(95), p99: p(99), samples: sorted.length } : null,
  });
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
