import express from "express";
import Note from "../models?Note.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const notes = await Note.find();
    res.json(notes);
});

router.post("/", async (req, res) => {
    const newNote = new Note(req, res);
    await newNote.save();
    res.json(newNote);
});

router.put("/:id", async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted"});
});

export default router;