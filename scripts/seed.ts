import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'data', 'database.sqlite');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Create tables
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

// Clear existing data
db.prepare('DELETE FROM courses').run();
db.prepare('DELETE FROM column_settings').run();
db.prepare('DELETE FROM admins').run();

// Seed admin
const hash = bcrypt.hashSync('reb123', 10);
db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run('reb123', hash);

// Seed column settings
const columns = [
  { key: 'Program', display: 'Program', visible: 1, is_filter: 1, filter_label: 'Study Abroad Program', sort: 0 },
  { key: 'Foreign Course Title', display: 'Foreign Course Title', visible: 1, is_filter: 0, filter_label: null, sort: 1 },
  { key: 'Foreign Course Code', display: 'Foreign Course Code', visible: 1, is_filter: 0, filter_label: null, sort: 2 },
  { key: 'Foreign Course Credits', display: 'Foreign Course Credits', visible: 1, is_filter: 0, filter_label: null, sort: 3 },
  { key: 'Pace Equivalent Course', display: 'Pace Equivalent Course', visible: 1, is_filter: 0, filter_label: null, sort: 4 },
  { key: 'Pace Code', display: 'Pace Code', visible: 1, is_filter: 0, filter_label: null, sort: 5 },
  { key: 'AOK', display: 'AOK', visible: 1, is_filter: 1, filter_label: 'Area of Knowledge (AOK)', sort: 6 },
  { key: 'Pace School', display: 'Pace School', visible: 0, is_filter: 1, filter_label: 'Pace School', sort: 7 },
  { key: 'Department', display: 'Department', visible: 1, is_filter: 1, filter_label: 'Pace Department', sort: 8 },
];

const insertCol = db.prepare(
  'INSERT INTO column_settings (column_key, display_name, visible, is_filter, filter_label, sort_order) VALUES (?, ?, ?, ?, ?, ?)'
);

for (const col of columns) {
  insertCol.run(col.key, col.display, col.visible, col.is_filter, col.filter_label, col.sort);
}

// Seed sample courses matching the screenshot
const courses = [
  {
    "Program": "Aalto University (Seidenberg students only)",
    "Foreign Course Title": "Basic Course in C Programming",
    "Foreign Course Code": "ELEC-A7100",
    "Foreign Course Credits": 5,
    "Pace Equivalent Course": "Introduction to Computer Science",
    "Pace Code": "CS 121",
    "AOK": "",
    "Pace School": "Seidenberg",
    "Department": "Computer Science"
  },
  {
    "Program": "Aalto University (Seidenberg students only)",
    "Foreign Course Title": "Linux Basics",
    "Foreign Course Code": "ELEC-A7310",
    "Foreign Course Credits": 3,
    "Pace Equivalent Course": "Fundmntls of Unix and C Prgmng",
    "Pace Code": "CS 271",
    "AOK": "",
    "Pace School": "Seidenberg",
    "Department": "Computer Science"
  },
  {
    "Program": "Aalto University (Seidenberg students only)",
    "Foreign Course Title": "Information Security",
    "Foreign Course Code": "CS-C3130",
    "Foreign Course Credits": 5,
    "Pace Equivalent Course": "Security in Computing",
    "Pace Code": "CS 331",
    "AOK": "",
    "Pace School": "Seidenberg",
    "Department": "Computer Science"
  },
  {
    "Program": "Aalto University (Seidenberg students only)",
    "Foreign Course Title": "Data Structures and Algorithms",
    "Foreign Course Code": "CS-A1140",
    "Foreign Course Credits": 5,
    "Pace Equivalent Course": "Data Structures & Algorithms",
    "Pace Code": "CS 242",
    "AOK": "",
    "Pace School": "Seidenberg",
    "Department": "Computer Science"
  },
  {
    "Program": "Aalto University (Seidenberg students only)",
    "Foreign Course Title": "Web Software Development",
    "Foreign Course Code": "CS-C3170",
    "Foreign Course Credits": 5,
    "Pace Equivalent Course": "Web Development",
    "Pace Code": "CS 325",
    "AOK": "",
    "Pace School": "Seidenberg",
    "Department": "Computer Science"
  },
  {
    "Program": "American College Dublin",
    "Foreign Course Title": "Introduction to Marketing",
    "Foreign Course Code": "MKT-101",
    "Foreign Course Credits": 3,
    "Pace Equivalent Course": "Marketing",
    "Pace Code": "MKT 250",
    "AOK": "World Traditions",
    "Pace School": "Lubin",
    "Department": "Marketing"
  },
  {
    "Program": "American College Dublin",
    "Foreign Course Title": "Financial Accounting",
    "Foreign Course Code": "ACC-201",
    "Foreign Course Credits": 3,
    "Pace Equivalent Course": "Financial Accounting",
    "Pace Code": "ACC 203",
    "AOK": "",
    "Pace School": "Lubin",
    "Department": "Accounting"
  },
  {
    "Program": "American College Dublin",
    "Foreign Course Title": "Creative Writing",
    "Foreign Course Code": "ENG-220",
    "Foreign Course Credits": 3,
    "Pace Equivalent Course": "Creative Writing Workshop",
    "Pace Code": "ENG 201",
    "AOK": "Civic Engagement",
    "Pace School": "Dyson",
    "Department": "English"
  },
  {
    "Program": "American University of Rome",
    "Foreign Course Title": "Italian Language I",
    "Foreign Course Code": "ITA-101",
    "Foreign Course Credits": 3,
    "Pace Equivalent Course": "Elementary Italian I",
    "Pace Code": "ITA 111",
    "AOK": "World Traditions",
    "Pace School": "Dyson",
    "Department": "Modern Languages"
  },
  {
    "Program": "American University of Rome",
    "Foreign Course Title": "Art History: Ancient Rome",
    "Foreign Course Code": "ART-210",
    "Foreign Course Credits": 3,
    "Pace Equivalent Course": "Art History Survey",
    "Pace Code": "ART 101",
    "AOK": "Creativity & Innovation",
    "Pace School": "Dyson",
    "Department": "Art"
  },
  {
    "Program": "Australian Catholic University",
    "Foreign Course Title": "Business Statistics",
    "Foreign Course Code": "STAT-200",
    "Foreign Course Credits": 3,
    "Pace Equivalent Course": "Statistics for Business",
    "Pace Code": "MAT 104",
    "AOK": "Life Science & Physical",
    "Pace School": "Lubin",
    "Department": "Mathematics"
  },
  {
    "Program": "Australian Catholic University",
    "Foreign Course Title": "Psychology 101",
    "Foreign Course Code": "PSY-101",
    "Foreign Course Credits": 3,
    "Pace Equivalent Course": "General Psychology",
    "Pace Code": "PSY 111",
    "AOK": "Self & Society",
    "Pace School": "Dyson",
    "Department": "Psychology"
  },
  {
    "Program": "City University London",
    "Foreign Course Title": "Journalism Ethics",
    "Foreign Course Code": "JRN-300",
    "Foreign Course Credits": 4,
    "Pace Equivalent Course": "Ethics in Media",
    "Pace Code": "COM 310",
    "AOK": "Civic Engagement",
    "Pace School": "Dyson",
    "Department": "Communications"
  },
  {
    "Program": "City University London",
    "Foreign Course Title": "British Politics",
    "Foreign Course Code": "POL-210",
    "Foreign Course Credits": 3,
    "Pace Equivalent Course": "Comparative Politics",
    "Pace Code": "POL 201",
    "AOK": "Self & Society",
    "Pace School": "Dyson",
    "Department": "Political Science"
  },
  {
    "Program": "Dublin City University",
    "Foreign Course Title": "Software Engineering",
    "Foreign Course Code": "CS-310",
    "Foreign Course Credits": 5,
    "Pace Equivalent Course": "Software Engineering",
    "Pace Code": "CS 389",
    "AOK": "",
    "Pace School": "Seidenberg",
    "Department": "Computer Science"
  },
  {
    "Program": "EDHEC Business School",
    "Foreign Course Title": "International Finance",
    "Foreign Course Code": "FIN-401",
    "Foreign Course Credits": 3,
    "Pace Equivalent Course": "International Financial Mgmt",
    "Pace Code": "FIN 350",
    "AOK": "",
    "Pace School": "Lubin",
    "Department": "Finance"
  },
  {
    "Program": "EDHEC Business School",
    "Foreign Course Title": "Global Marketing Strategy",
    "Foreign Course Code": "MKT-350",
    "Foreign Course Credits": 3,
    "Pace Equivalent Course": "Global Marketing",
    "Pace Code": "MKT 355",
    "AOK": "World Traditions",
    "Pace School": "Lubin",
    "Department": "Marketing"
  },
  {
    "Program": "Griffith University",
    "Foreign Course Title": "Environmental Science",
    "Foreign Course Code": "ENV-200",
    "Foreign Course Credits": 3,
    "Pace Equivalent Course": "Environmental Science",
    "Pace Code": "ENV 296",
    "AOK": "Life Science & Physical",
    "Pace School": "Dyson",
    "Department": "Environmental Studies"
  },
  {
    "Program": "Griffith University",
    "Foreign Course Title": "Microeconomics",
    "Foreign Course Code": "ECO-101",
    "Foreign Course Credits": 3,
    "Pace Equivalent Course": "Principles of Microeconomics",
    "Pace Code": "ECO 105",
    "AOK": "",
    "Pace School": "Lubin",
    "Department": "Economics"
  },
  {
    "Program": "John Cabot University",
    "Foreign Course Title": "Roman History",
    "Foreign Course Code": "HIS-250",
    "Foreign Course Credits": 3,
    "Pace Equivalent Course": "Western Civilization I",
    "Pace Code": "HIS 111",
    "AOK": "World Traditions",
    "Pace School": "Dyson",
    "Department": "History"
  },
];

const insertCourse = db.prepare('INSERT INTO courses (data) VALUES (?)');
const insertMany = db.transaction((courses: Record<string, unknown>[]) => {
  for (const course of courses) {
    insertCourse.run(JSON.stringify(course));
  }
});
insertMany(courses);

console.log(`Seeded ${courses.length} courses, ${columns.length} column settings, and 1 admin user.`);
db.close();
