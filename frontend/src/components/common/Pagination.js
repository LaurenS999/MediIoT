import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  onPageChange,
  pages,
  totalPages,
}) {
  return (
    <div className="pagination">
      <button
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map((item, idx) =>
        typeof item === "number" ? (
          <button
            key={`page-${item}`}
            onClick={() => onPageChange(item)}
            className={currentPage === item ? "active" : ""}
          >
            {item}
          </button>
        ) : (
          <span key={`ellipsis-${idx}`} className="ellipsis">
            ...
          </span>
        ),
      )}

      <button
        className="pagination-arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
