import { useEffect, useState } from "react";
import API from "../api/axios";

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");

    const fetchNotes = async () => {
        const res = await API.get("/notes");
        setNotes(res.data);
    };

    const addNote = async () => {
        await API.post("/notes", { content });
        setContent("");
        fetchNotes();
    };

    const deleteNote = async (id) => {
        await API.delete(`/notes/${id}`);
        fetchNotes();
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Notes</h2>
            <div className="flex gap-2 mb-4">
                <input
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a note..."
                    className="border p-2 flex-1"
                />
                <button onClick={addNote} className="bg-purple-600 text-white px-4 py-2 rounded">Add</button>
            </div>
            <ul>
                {notes.map((n) => (
                    <li key={n._id} className="flex justify-between border-b py-2">
                        {n.content}
                        <button onClick={() => deleteNote(n._id)} className="text-red-500">Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notes;
