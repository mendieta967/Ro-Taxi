import { MapPin } from "lucide-react";

const MapSearchResult = ({ searchResults, handleSelect }) => {
  return (
    <div className="bg-[#23262F] w-full h-full rounded shadow-2xl overflow-y-auto scrollbar-custom ">
      {/* Ubicación actual */}

      {/* Sugerencias */}
      {searchResults.length > 0 && (
        <ul className="bg-transparent border-0 rounded-none shadow-none w-full ">
          {searchResults.map((sug, idx) => {
            return (
              <li
                key={sug.place_id}
                title={sug.display_name}
                className={`flex  gap-2 px-4 py-2.5 cursor-pointer ${
                  idx !== searchResults.length - 1
                    ? "border-b border-[#23262F]"
                    : ""
                } bg-none text-white  text-sm hover:bg-gray-800`}
                onClick={() => handleSelect(sug)}
                onMouseDown={(e) => e.preventDefault()}
              >
                <div className="flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <span className="overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold">
                  {sug.display_name}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MapSearchResult;
