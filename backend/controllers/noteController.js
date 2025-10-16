import Note from "../models/noteModel.js";

// CREATE note
export const createNote = async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        const note = await Note.create({ title, content, userId });
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// READ all notes for a user
export const getNotes = async (req, res) => {
    try {
        const { userId } = req.params;
        const notes = await Note.find({ userId }).sort({ createdAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// READ single note
export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        res.json(note);
    } catch (error) {
        res.status(404).json({ message: "Note not found" });
    }
};

// UPDATE note
export const updateNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE note
export const deleteNote = async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
