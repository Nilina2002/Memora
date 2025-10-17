import { useState } from "react";
import React from 'react'


const NoteForm = ({ onAdd, loading }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const canSubmit = content.trim().length > 0 && !loading;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        await onAdd({ title: title.trim(), content: content.trim() });
        setTitle("");
        setContent("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border rounded p-2"
            />
            <textarea
                placeholder="Write a note..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border rounded p-2 h-28"
            />
            <button disabled={!canSubmit} className="bg-purple-600 disabled:opacity-60 text-white px-4 py-2 rounded w-fit">
                {loading ? "Adding..." : "Add note"}
            </button>
        </form>
    );
};

export default NoteForm;


