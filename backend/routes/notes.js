import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

// Get all notes
router.get("/", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// Create new note
router.post("/", async (req, res) => {
  const newNote = new Note(req.body);
  await newNote.save();
  res.json(newNote);
});

// ✅ Update note by ID
router.put("/:id", async (req, res) => {
  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedNote);
});

// Delete note by ID
router.delete("/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Note deleted" });
});

export default router;
