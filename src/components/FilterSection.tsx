"use client";

interface FilterConfig {
  key: string;
  label: string;
  options: string[];
}

interface FilterSectionProps {
  filters: FilterConfig[];
  activeFilters: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
}

export default function FilterSection({
  filters,
  activeFilters,
  onFilterChange,
}: FilterSectionProps) {
  if (filters.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 mt-6 mb-6 relative z-10">
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filters.map((filter) => (
            <div key={filter.key}>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {filter.label}
              </label>
              <select
                value={activeFilters[filter.key] || "All"}
                onChange={(e) => onFilterChange(filter.key, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="All">All</option>
                {filter.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
