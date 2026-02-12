"use client";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCourses: number;
}

export default function HeroSection({
  searchQuery,
  onSearchChange,
  totalCourses,
}: HeroSectionProps) {
  return (
    <div
      className="w-full py-12 px-6"
      style={{ backgroundColor: "#0a1628" }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Find Your Course Equivalencies
        </h1>
        <p className="text-gray-300 text-lg mb-2">
          Search pre-approved foreign courses that transfer to Pace University
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Explore over {totalCourses > 0 ? totalCourses.toLocaleString() : "3,000"} course
          equivalencies from partner institutions worldwide
        </p>
        <div className="max-w-2xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by course name, code, or program..."
            className="w-full px-6 py-4 rounded-lg text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
            style={{ backgroundColor: "#ffffff" }}
          />
        </div>
      </div>
    </div>
  );
}
