"use client";

interface SearchBarProps {
    search: string;
    setSearch: (value: string) => void;
}

export default function SearchBar({search, setSearch}: SearchBarProps){
    return(
        <div className="w-full">
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="search products ecomerce" 
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"/>
        </div>
    )
}
