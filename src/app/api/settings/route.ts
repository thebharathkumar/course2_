import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromCookie } from '@/lib/auth';
import { getColumnSettings, updateColumnSetting } from '@/lib/db';

export async function GET() {
  try {
    const settings = getColumnSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify auth
    const cookieHeader = request.headers.get('cookie');
    const token = getTokenFromCookie(cookieHeader);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { settings } = await request.json();

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: 'Invalid settings format' }, { status: 400 });
    }

    for (const setting of settings) {
      updateColumnSetting(setting.column_key, {
        visible: setting.visible,
        is_filter: setting.is_filter,
        filter_label: setting.filter_label,
        display_name: setting.display_name,
      });
    }

    const updatedSettings = getColumnSettings();
    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
