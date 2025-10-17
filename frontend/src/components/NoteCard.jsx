const NoteCard = ({ note, onDelete }) => {
    return (
        <li className="group rounded-xl p-3 flex justify-between items-start gap-3 bg-white border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-1">
                {note.title ? (
                    <div className="font-medium text-gray-900 mb-1">{note.title}</div>
                ) : null}
                <div className="text-gray-700 whitespace-pre-wrap text-sm">{note.content}</div>
            </div>
            <button onClick={() => onDelete(note._id)} className="opacity-0 group-hover:opacity-100 text-red-600 text-xs">Delete</button>
        </li>
    );
};

export default NoteCard;


