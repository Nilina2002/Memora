import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        userId: {
            type: String, // Will link to Clerk or JWT user ID later
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        tags: [String], // optional field for later AI tagging
    },
    {
        timestamps: true,
    }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;
