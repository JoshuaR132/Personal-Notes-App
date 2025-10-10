import express from "express";
import Note from "../models/Note.js";
import { requireAuth } from "../middleware/auth.js";
import { validationResult } from "express-validator";
import { noteCreateValidator, noteUpdateValidator, notesQueryValidator } from "../middleware/validators.js";

const router = express.Router();

// All routes require auth
router.use(requireAuth);

// GET /api/notes?search=...&tags=tag1,tag2
router.get("/", notesQueryValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { search, tags, sort } = req.query;
  const userId = req.user.id;

  const filter = { user: userId };

  if (search) {
    const re = new RegExp(search, "i");
    filter.$or = [{ title: re }, { content: re }];
  }

  if (tags) {
    // tags query as comma separated list
    const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);
    if (tagsArray.length) filter.tags = { $all: tagsArray }; // matches notes that contain all tags
  }

  // optional sorting: sort=updatedAt or sort=createdAt or sort=-createdAt
  const sortOption = sort ? { [sort.replace("-", "")]: sort.startsWith("-") ? -1 : 1 } : { updatedAt: -1 };

  try {
    const notes = await Note.find(filter).sort(sortOption);
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/notes
router.post("/", noteCreateValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const userId = req.user.id;
    const { title, content, tags } = req.body;
    const note = new Note({ user: userId, title, content, tags: tags || [] });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/notes/:id
router.put("/:id", noteUpdateValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const userId = req.user.id;
    const noteId = req.params.id;
    // ensure the note belongs to the user
    const note = await Note.findOne({ _id: noteId, user: userId });
    if (!note) return res.status(404).json({ message: "Note not found" });

    const updates = {};
    if (req.body.title !== undefined) updates.title = req.body.title;
    if (req.body.content !== undefined) updates.content = req.body.content;
    if (req.body.tags !== undefined) updates.tags = req.body.tags;

    const updated = await Note.findByIdAndUpdate(noteId, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/notes/:id
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const noteId = req.params.id;
    const note = await Note.findOneAndDelete({ _id: noteId, user: userId });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
