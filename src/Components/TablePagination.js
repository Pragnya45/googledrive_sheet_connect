import { useState, useEffect } from "react";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

export default function TablePagination({
  fetchNextPage,
  fetchPreviousPage,
  pagination,
  fetchPage,
  onLimitChange,
  refetch,
}) {
  const totalPages = pagination?.totalPages || 1;
  const [page, setPage] = useState(pagination?.page || 1);
  const [limit, setLimit] = useState(10);

  const handleClick = (pageNumber) => {
    if (pageNumber && pageNumber !== page) {
      setPage(pageNumber);
      fetchPage(pageNumber);
    }
  };
  const handleLimitChange = (e) => {
    updateLimit(e.target.value);
  };
  const updateLimit = (newLimit) => {
    setLimit(newLimit);
    fetchPage(1);
    onLimitChange?.(newLimit);
    refetch();
  };
  const handlePrevClick = () => {
    if (page > 1) {
      fetchPreviousPage();
      setPage(page - 1);
    }
  };
  const handleNextClick = () => {
    if (page < totalPages) {
      fetchNextPage();
      setPage(page + 1);
    }
  };
  const getPageNumbers = () => {
    const displayPages = 5;
    const pages = [1];
    let startPage = Math.max(2, page - 2);
    let endPage = Math.min(totalPages - 1, page + 2);
    if (startPage > 2) pages.push(null);
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages - 1) pages.push(null);
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  if ((totalPages === 1 && page === 1) || !pagination?.totalResults) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        gap: "8px",
        marginTop: "24px",
      }}
    >
      <button
        onClick={handlePrevClick}
        disabled={page === 1}
        style={{
          opacity: page === 1 ? 0.5 : 1,
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          border: "none",
        }}
      >
        <ArrowBackIosRoundedIcon style={{ fontSize: "32px", color: "black" }} />
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {getPageNumbers().map((pageNumber, index) => (
          <div
            key={index}
            onClick={() => handleClick(pageNumber)}
            style={{
              cursor: pageNumber ? "pointer" : "default",
              background: pageNumber ? "#273142" : "transparent",
              color: pageNumber ? "white" : "#98A2B3",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "12px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border:
                pageNumber && page === pageNumber
                  ? "1px solid #98A2B3"
                  : "none",
              pointerEvents: pageNumber ? "auto" : "none",
            }}
          >
            {pageNumber ? pageNumber : "..."}
          </div>
        ))}
      </div>
      <button
        onClick={handleNextClick}
        disabled={page === totalPages}
        style={{
          opacity: page === totalPages ? 0.5 : 1,
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          border: "none",
        }}
      >
        <ArrowForwardIosRoundedIcon
          style={{ fontSize: "32px", color: "black" }}
        />
      </button>
    </div>
  );
}
