import { Link } from "react-router-dom";

const Sidebar = ({ onCreate }) => {
    return (
        <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r bg-white p-4 gap-3">
            <div className="flex items-center gap-2 px-2 py-3">
                <div className="h-8 w-8 rounded-full bg-green-400" />
                <div className="leading-tight">
                    <div className="text-sm font-semibold">Syncscribe</div>
                    <div className="text-xs text-gray-500">Meet Desai</div>
                </div>
            </div>

            <button onClick={onCreate} className="flex items-center justify-between bg-gray-900 hover:bg-black text-white px-3 py-2 rounded-lg">
                <span>Create Note</span>
                <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">N</span>
            </button>

            <nav className="flex flex-col gap-1 text-sm">
                <Link className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100" to="#">
                    <span>Search</span>
                    <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded">S</span>
                </Link>
                <Link className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100" to="#">
                    <span>Archives</span>
                    <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded">R</span>
                </Link>
            </nav>

            <div className="mt-2 px-2 text-xs uppercase tracking-wide text-gray-500">Folders</div>
            <div className="flex items-center justify-between px-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <span className="icon"/> 
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-gray-500">+</button>
                </div>
            </div>

            <ul className="text-sm px-2 space-y-1">
                {[
                    "Bucket List",
                    "Finances",
                    "Travel Plans",
                    "Shopping",
                    "Personal",
                    "Work",
                    "Projects",
                ].map((f) => (
                    <li key={f} className="px-2 py-1 rounded-lg hover:bg-gray-100 cursor-default">{f}</li>
                ))}
            </ul>
            <div className="mt-auto border-t pt-3 space-y-1 text-sm">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">Help</button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100">Settings</button>
            </div>
        </aside>
    );
};

export default Sidebar;


