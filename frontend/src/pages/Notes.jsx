import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import NoteForm from "../components/NoteForm";
import NoteCard from "../components/NoteCard";
import Sidebar from "../components/Sidebar";

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");

    const fetchNotes = async () => {
        try {
            setError("");
            const res = await API.get("/notes");
            setNotes(res.data);
        } catch (e) {
            setError(e?.response?.data?.message || "Failed to load notes");
        }
    };

    const addNote = async ({ title, content }) => {
        try {
            setLoading(true);
            setError("");
            await API.post("/notes", { title, content });
            await fetchNotes();
        } catch (e) {
            setError(e?.response?.data?.message || "Failed to add note");
        } finally {
            setLoading(false);
        }
    };

    const deleteNote = async (id) => {
        try {
            setLoading(true);
            setError("");
            await API.delete(`/notes/${id}`);
            await fetchNotes();
        } catch (e) {
            setError(e?.response?.data?.message || "Failed to delete note");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const filtered = useMemo(() => {
        if (!query.trim()) return notes;
        const q = query.toLowerCase();
        return notes.filter((n) => (n.title || "").toLowerCase().includes(q) || (n.content || "").toLowerCase().includes(q));
    }, [notes, query]);

    return (
        <div className="flex min-h-[100vh] bg-gray-50">
            <Sidebar onCreate={() => {}} />
            <main className="flex-1 p-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">My Notes</h2>
                        <div className="flex items-center bg-white border rounded-full p-1 text-sm shadow-sm">
                            <button className="px-3 py-1 rounded-full bg-gray-900 text-white">Today</button>
                            <button className="px-3 py-1 rounded-full hover:bg-gray-100">This Week</button>
                            <button className="px-3 py-1 rounded-full hover:bg-gray-100">This Month</button>
                        </div>
                    </div>

                    {error ? (
                        <div className="mb-3 text-red-600 text-sm">{error}</div>
                    ) : null}

                    <div className="mb-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <NoteForm onAdd={addNote} loading={loading} />
                        <div className="md:col-span-1 lg:col-span-2 bg-white border rounded p-3">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm text-gray-600">Filter</div>
                                <input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search notes..."
                                    className="border rounded-lg p-2 w-64"
                                />
                            </div>
                            <ul className="grid gap-3 md:grid-cols-2">
                                {filtered.map((n) => (
                                    <NoteCard key={n._id} note={n} onDelete={deleteNote} />
                                ))}
                            </ul>
                        </div>
                    </div>

                    <section className="mt-8">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">Recent Folders</h3>
                            <div className="flex items-center bg-white border rounded-full p-1 text-sm">
                                <button className="px-3 py-1 rounded-full bg-gray-900 text-white">All</button>
                                <button className="px-3 py-1 rounded-full">Recent</button>
                                <button className="px-3 py-1 rounded-full">Last modified</button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {["BL","Fi","TP","Sh","Pe"].map((abbr) => (
                                <div key={abbr} className="flex flex-col items-center gap-2">
                                    <div className="h-16 w-16 rounded-md bg-gradient-to-b from-orange-300 to-orange-500 shadow-inner flex items-center justify-center text-white font-semibold">
                                        {abbr}
                                    </div>
                                    <div className="text-sm text-gray-700">Folder</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Notes;
