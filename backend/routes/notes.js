import express from "express";
import { body, validationResult } from "express-validator";
import Note from "../models/Note.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Protect all /notes routes
router.use(authMiddleware);

// GET /notes?search=xxx&tags=tag1,tag2
router.get("/", async (req, res) => {
  const { search, tags } = req.query;
  let filter = { owner: req.userId };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  if (tags) {
    filter.tags = { $in: tags.split(",") };
  }

  try {
    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /notes
router.post(
  "/",
  body("title").notEmpty(),
  body("content").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const note = new Note({ ...req.body, owner: req.userId });
      await note.save();
      res.json(note);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// PUT /notes/:id
router.put("/:id", async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, owner: req.userId },
      req.body,
      { new: true }
    );
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /notes/:id
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
