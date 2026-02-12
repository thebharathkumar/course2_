import { NextRequest, NextResponse } from 'next/server';
import { searchCourses, getVisibleColumns, getFilterColumns } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const filters: Record<string, string> = {};

    // Collect filter parameters
    for (const [key, value] of searchParams.entries()) {
      if (key.startsWith('filter_') && value && value !== 'All') {
        filters[key.replace('filter_', '')] = value;
      }
    }

    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '50');

    // Get courses matching search
    let courses = searchCourses(query);

    // Apply filters
    if (Object.keys(filters).length > 0) {
      courses = courses.filter((course) => {
        const data = JSON.parse(course.data);
        return Object.entries(filters).every(([key, value]) => {
          const courseValue = data[key];
          return courseValue && String(courseValue).toLowerCase() === value.toLowerCase();
        });
      });
    }

    // Get visible columns
    const visibleColumns = getVisibleColumns();
    const filterColumns = getFilterColumns();

    // Build filter options from data
    const filterOptions: Record<string, string[]> = {};
    for (const fc of filterColumns) {
      const allCourses = searchCourses('');
      const values = new Set<string>();
      for (const course of allCourses) {
        const data = JSON.parse(course.data);
        const val = data[fc.column_key];
        if (val && String(val).trim()) {
          values.add(String(val).trim());
        }
      }
      filterOptions[fc.column_key] = Array.from(values).sort();
    }

    // Paginate
    const total = courses.length;
    const start = (page - 1) * pageSize;
    const paginatedCourses = courses.slice(start, start + pageSize);

    // Format response with only visible columns
    const formattedCourses = paginatedCourses.map((course) => {
      const data = JSON.parse(course.data);
      const filtered: Record<string, unknown> = { id: course.id };
      for (const col of visibleColumns) {
        filtered[col.column_key] = data[col.column_key] || '';
      }
      return filtered;
    });

    return NextResponse.json({
      courses: formattedCourses,
      columns: visibleColumns.map((col) => ({
        key: col.column_key,
        label: col.display_name,
      })),
      filters: filterColumns.map((fc) => ({
        key: fc.column_key,
        label: fc.filter_label || fc.display_name,
        options: filterOptions[fc.column_key] || [],
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('Courses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
