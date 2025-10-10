import express from "express";
import Note from "../models/Note.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newNote = new Note(req.body);
        await newNote.save();
        res.status(201).json(newNote);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Note deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedNote);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
