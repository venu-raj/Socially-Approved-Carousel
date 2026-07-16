import express from "express";
import cors from "cors";
import videoRouter from "./routes/video";

const app = express();

const corsOptions = {
  origin: [process.env.FRONTEND_URL || "http://localhost:3000"].filter(Boolean),
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/videos", videoRouter);

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to Home!!!!!!!");
});

// API Route
app.get("/api", (req, res) => {
  res.send("Welcome to Api!!!!!!!");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
});

app.use((err: any, res: express.Response) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
  });
}

export default app;
