"use client";

interface Column {
  key: string;
  label: string;
}

interface CourseTableProps {
  courses: Record<string, unknown>[];
  columns: Column[];
  loading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Columns that should display as colored badges
const BADGE_COLUMNS = ["department", "aok", "area of knowledge", "school", "pace school"];

function isBadgeColumn(label: string): boolean {
  return BADGE_COLUMNS.some((bc) => label.toLowerCase().includes(bc));
}

export default function CourseTable({
  courses,
  columns,
  loading,
  total,
  page,
  totalPages,
  onPageChange,
}: CourseTableProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-12">
      {total > 0 && !loading && (
        <div className="text-sm text-gray-500 mb-3">
          {total.toLocaleString()} course{total !== 1 ? "s" : ""} found
        </div>
      )}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length || 1}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading courses...
                    </div>
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length || 1}
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    No courses found. Try adjusting your search or filters.
                  </td>
                </tr>
              ) : (
                courses.map((course, index) => (
                  <tr
                    key={course.id as number || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 text-sm text-gray-700"
                      >
                        {isBadgeColumn(col.label) && course[col.key] ? (
                          <span
                            className="inline-block px-3 py-1 text-xs font-medium text-white rounded-md"
                            style={{ backgroundColor: "#1e40af" }}
                          >
                            {String(course[col.key])}
                          </span>
                        ) : (
                          String(course[col.key] || "")
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing {((page - 1) * 50) + 1} to {Math.min(page * 50, total)} of{" "}
              {total.toLocaleString()} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
