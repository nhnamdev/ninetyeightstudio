"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchDropdown: React.FC<SearchDropdownProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `https://wwyn.vn/tim-kiem?keyword=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`search-dropdown ${isOpen ? "active" : ""}`}
    >
      <button type="submit" className="search-icon-btn" aria-label="Tìm kiếm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>
      <input
        ref={inputRef}
        type="text"
        placeholder="Nhập từ khóa cần tìm..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        type="button"
        className="search-close-btn"
        onClick={onClose}
        aria-label="Đóng"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </form>
  );
};
