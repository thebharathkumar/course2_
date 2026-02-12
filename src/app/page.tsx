"use client";

import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FilterSection from "@/components/FilterSection";
import CourseTable from "@/components/CourseTable";

interface Column {
  key: string;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: string[];
}

interface CoursesResponse {
  courses: Record<string, unknown>[];
  columns: Column[];
  filters: FilterConfig[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [courses, setCourses] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [filters, setFilters] = useState<FilterConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      params.set("page", String(page));
      params.set("pageSize", "50");

      for (const [key, value] of Object.entries(activeFilters)) {
        if (value && value !== "All") {
          params.set(`filter_${key}`, value);
        }
      }

      const response = await fetch(`/api/courses?${params.toString()}`);
      const data: CoursesResponse = await response.json();

      setCourses(data.courses || []);
      setColumns(data.columns || []);
      setFilters(data.filters || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, activeFilters, page]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchCourses();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchCourses]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <Header />
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        totalCourses={total}
      />
      <FilterSection
        filters={filters}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
      />
      <CourseTable
        courses={courses}
        columns={columns}
        loading={loading}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
