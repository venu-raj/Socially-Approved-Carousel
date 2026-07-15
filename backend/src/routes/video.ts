import { Router, Request, Response } from "express";
import { NewVideo, videos } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

const videoRouter = Router();

videoRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const newVideo: NewVideo = req.body;

    const [video] = await db.insert(videos).values(newVideo).returning();

    res.status(201).json({
      success: true,
      data: video,
      message: "Video created successfully",
    });
  } catch (e) {
    console.error("Error creating video:", e);
    res.status(500).json({
      success: false,
      error: "Failed to create video",
    });
  }
});

videoRouter.post(
  "/bulk",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const videosData: NewVideo[] = req.body;

      if (!Array.isArray(videosData) || videosData.length === 0) {
        res.status(400).json({
          success: false,
          error: "Please provide an array of videos",
        });
        return;
      }

      const insertedVideos = await db
        .insert(videos)
        .values(videosData)
        .returning();

      res.status(201).json({
        success: true,
        data: insertedVideos,
        count: insertedVideos.length,
        message: `${insertedVideos.length} videos created successfully`,
      });
    } catch (e) {
      console.error("Error creating bulk videos:", e);
      res.status(500).json({
        success: false,
        error: "Failed to create videos",
      });
    }
  },
);

videoRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const totalCount = await db.select().from(videos);
    const total = totalCount.length;

    const allVideos = await db
      .select()
      .from(videos)
      .limit(limit)
      .offset(offset)
      .orderBy(videos.createdAt);

    res.status(200).json({
      success: true,
      data: allVideos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    console.error("Error fetching videos:", e);
    res.status(500).json({
      success: false,
      error: "Failed to fetch videos",
    });
  }
});

videoRouter.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      res.status(400).json({
        success: false,
        error: "Invalid video ID format",
      });
      return;
    }

    const [video] = await db.select().from(videos).where(eq(videos.id, id));

    if (!video) {
      res.status(404).json({
        success: false,
        error: "Video not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: video,
    });
  } catch (e) {
    console.error("Error fetching video:", e);
    res.status(500).json({
      success: false,
      error: "Failed to fetch video",
    });
  }
});

videoRouter.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      res.status(400).json({
        success: false,
        error: "Invalid video ID format",
      });
      return;
    }

    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, id));

    if (!existingVideo) {
      res.status(404).json({
        success: false,
        error: "Video not found",
      });
      return;
    }

    const updateData = req.body;
    const [updatedVideo] = await db
      .update(videos)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(videos.id, id))
      .returning();

    res.status(200).json({
      success: true,
      data: updatedVideo,
      message: "Video updated successfully",
    });
  } catch (e) {
    console.error("Error updating video:", e);
    res.status(500).json({
      success: false,
      error: "Failed to update video",
    });
  }
});

export default videoRouter;
