import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'data', 'database.sqlite');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS column_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      column_key TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      visible INTEGER NOT NULL DEFAULT 1,
      is_filter INTEGER NOT NULL DEFAULT 0,
      filter_label TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );
  `);

  // Seed default admin if not exists
  const admin = db.prepare('SELECT id FROM admins WHERE username = ?').get('reb123');
  if (!admin) {
    const hash = bcrypt.hashSync('reb123', 10);
    db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('reb123', hash);
  }
}

export interface CourseRow {
  id: number;
  data: string;
}

export interface ColumnSetting {
  id: number;
  column_key: string;
  display_name: string;
  visible: number;
  is_filter: number;
  filter_label: string | null;
  sort_order: number;
}

// Course operations
export function getAllCourses(): CourseRow[] {
  const db = getDb();
  return db.prepare('SELECT * FROM courses').all() as CourseRow[];
}

export function searchCourses(query: string): CourseRow[] {
  const db = getDb();
  const allCourses = db.prepare('SELECT * FROM courses').all() as CourseRow[];
  if (!query) return allCourses;

  const lowerQuery = query.toLowerCase();
  return allCourses.filter((course) => {
    const data = JSON.parse(course.data);
    return Object.values(data).some(
      (val) => val && String(val).toLowerCase().includes(lowerQuery)
    );
  });
}

export function clearCourses() {
  const db = getDb();
  db.prepare('DELETE FROM courses').run();
}

export function insertCourses(courses: Record<string, unknown>[]) {
  const db = getDb();
  const insert = db.prepare('INSERT INTO courses (data) VALUES (?)');
  const insertMany = db.transaction((courses: Record<string, unknown>[]) => {
    for (const course of courses) {
      insert.run(JSON.stringify(course));
    }
  });
  insertMany(courses);
}

// Column settings operations
export function getColumnSettings(): ColumnSetting[] {
  const db = getDb();
  return db.prepare('SELECT * FROM column_settings ORDER BY sort_order ASC').all() as ColumnSetting[];
}

export function getVisibleColumns(): ColumnSetting[] {
  const db = getDb();
  return db.prepare('SELECT * FROM column_settings WHERE visible = 1 ORDER BY sort_order ASC').all() as ColumnSetting[];
}

export function getFilterColumns(): ColumnSetting[] {
  const db = getDb();
  return db.prepare('SELECT * FROM column_settings WHERE is_filter = 1 ORDER BY sort_order ASC').all() as ColumnSetting[];
}

export function clearColumnSettings() {
  const db = getDb();
  db.prepare('DELETE FROM column_settings').run();
}

export function insertColumnSetting(setting: Omit<ColumnSetting, 'id'>) {
  const db = getDb();
  db.prepare(
    'INSERT OR REPLACE INTO column_settings (column_key, display_name, visible, is_filter, filter_label, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(setting.column_key, setting.display_name, setting.visible, setting.is_filter, setting.filter_label, setting.sort_order);
}

export function updateColumnSetting(column_key: string, updates: Partial<Pick<ColumnSetting, 'visible' | 'is_filter' | 'filter_label' | 'display_name'>>) {
  const db = getDb();
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (updates.visible !== undefined) {
    fields.push('visible = ?');
    values.push(updates.visible);
  }
  if (updates.is_filter !== undefined) {
    fields.push('is_filter = ?');
    values.push(updates.is_filter);
  }
  if (updates.filter_label !== undefined) {
    fields.push('filter_label = ?');
    values.push(updates.filter_label);
  }
  if (updates.display_name !== undefined) {
    fields.push('display_name = ?');
    values.push(updates.display_name);
  }

  if (fields.length > 0) {
    values.push(column_key);
    db.prepare(`UPDATE column_settings SET ${fields.join(', ')} WHERE column_key = ?`).run(...values);
  }
}

// Admin operations
export function getAdmin(username: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM admins WHERE username = ?').get(username) as { id: number; username: string; password_hash: string } | undefined;
}
