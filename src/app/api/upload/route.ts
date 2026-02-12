import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { verifyToken, getTokenFromCookie } from '@/lib/auth';
import { clearCourses, insertCourses, clearColumnSettings, insertColumnSetting } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Verify auth
    const cookieHeader = request.headers.get('cookie');
    const token = getTokenFromCookie(cookieHeader);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read Excel file
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<string, unknown>[];

    if (jsonData.length === 0) {
      return NextResponse.json({ error: 'Excel file is empty' }, { status: 400 });
    }

    // Get column headers
    const columns = Object.keys(jsonData[0]);

    // Clear existing data
    clearCourses();
    clearColumnSettings();

    // Insert column settings with default visibility
    columns.forEach((col, index) => {
      insertColumnSetting({
        column_key: col,
        display_name: col,
        visible: 1,
        is_filter: 0,
        filter_label: null,
        sort_order: index,
      });
    });

    // Insert courses
    insertCourses(jsonData);

    return NextResponse.json({
      success: true,
      message: `Uploaded ${jsonData.length} courses with ${columns.length} columns`,
      columns,
      rowCount: jsonData.length,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
