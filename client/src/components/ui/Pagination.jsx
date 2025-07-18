import { ChevronLeft, ChevronRight } from "lucide-react";
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center mt-6 space-x-2 select-none">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
        className={`
          px-3 py-1 rounded transition cursor-pointer 
          ${
            currentPage === 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }
        `}
      >
        <ChevronLeft size={18} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => {
        const page = i + 1;
        const isActive = page === currentPage;

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={isActive ? "page" : undefined}
            className={`
              px-4 py-1 rounded-md transition font-medium 
              ${
                isActive
                  ? "bg-yellow-500 text-white shadow-md"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }
            `}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Página siguiente"
        className={`
          px-3 py-1 rounded transition cursor-pointer 
          ${
            currentPage === totalPages
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-200 dark:hover:bg-gray-700"
          }
        `}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};
export default Pagination;
