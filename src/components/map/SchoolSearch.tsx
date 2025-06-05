import { useState } from "react";
import { Sekolah } from "@/types/school";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

interface SchoolSearchProps {
  data: Sekolah[];
  onSchoolSelect: (school: Sekolah) => void;
  onSearchReset: () => void;
}

export default function SchoolSearch({
  data,
  onSchoolSelect,
  onSearchReset,
}: SchoolSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSchools, setFilteredSchools] = useState<Sekolah[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (query: string) => {
    try {
      setSearchQuery(query);
      if (query.length > 0) {
        const filtered = data.filter(
          (school) =>
            school.nama.toLowerCase().includes(query.toLowerCase()) ||
            school.alamat.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSchools(filtered);
        setShowResults(true);
      } else {
        setFilteredSchools([]);
        setShowResults(false);
        onSearchReset();
      }
    } catch (error) {
      console.error("Error during search:", error);
      setFilteredSchools([]);
      setShowResults(false);
    }
  };

  const handleSchoolSelect = (school: Sekolah) => {
    setSearchQuery(school.nama);
    setShowResults(false);
    onSchoolSelect(school);
  };

  return (
    <div className="absolute top-3 left-3 right-20 sm:right-3 md:top-4 md:left-4 md:right-auto md:w-80 lg:w-96 xl:w-[28rem] z-[1000]">
      <div className="relative">
        <div className="relative group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Cari sekolah..."
            className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/95 backdrop-blur-md shadow-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:shadow-xl 
              placeholder:text-neutral-500 text-neutral-700 border-0 text-sm
              transition-all duration-200 hover:bg-white touch-manipulation font-medium"
            style={{ fontSize: "16px" }} // Prevent zoom on iOS
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 
                transition-colors p-1.5 rounded-full hover:bg-neutral-100 active:scale-95 touch-manipulation"
            >
              <IoClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {showResults && filteredSchools.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-xl 
            shadow-lg border border-neutral-200/60 max-h-[50vh] overflow-y-auto divide-y divide-neutral-100
            animate-in fade-in slide-in-from-top-2 duration-200"
          >
            {filteredSchools.map((school) => (
              <button
                key={school.uuid}
                onClick={() => handleSchoolSelect(school)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50/80 transition-colors duration-150 
                  first:rounded-t-2xl last:rounded-b-2xl active:bg-blue-100 touch-manipulation"
              >
                <div className="font-medium text-neutral-900 text-sm sm:text-base line-clamp-2">
                  {school.nama}
                </div>
                <div className="text-xs sm:text-sm text-neutral-500 mt-1 line-clamp-1">
                  {school.alamat}
                </div>
                <div className="text-xs text-blue-600 mt-1 font-medium">
                  {school.bentuk_pendidikan}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
