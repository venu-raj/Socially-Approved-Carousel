// server.ts
import express from "express";
import cors from "cors";
import videoRouter from "./routes/video";

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Origin'
  ],
  exposedHeaders: ['Content-Length', 'X-Knowledge-Engine-Version'],
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/videos", videoRouter);

// Health check
app.get("/", (req, res) => {
  res.send("Welcome to my app!!!!!!!");
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

app.listen(8000, () => {
  console.log("🚀 Server started on port 8000");
  console.log(`📍 API available at http://localhost:8000/api/videos`);
});