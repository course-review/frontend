// Maps ETH Zurich course-number prefixes (the first three digits of a course
// number like "252-0026-00L") to the department that owns that number range,
// and the trailing letter of the course number to a human-readable course
// type (Vorlesung, Uebung, ...).
//
// UNVERIFIED: this map was NOT derived from the live `courses` table (no
// database was reachable while writing it). It is a static list of the
// well-known ETH department prefixes, is not exhaustive, and will drift out
// of date as new course numbers appear in the VVZ. Before relying on this
// for anything beyond a rough UI filter, verify/extend it with:
//
//   psql -c "SELECT substring(course_number,1,3) AS prefix, count(*) FROM courses GROUP BY 1 ORDER BY 2 DESC;"
//
// and add any missing prefixes below. Numbers that don't match a known
// prefix fall into the 'Other' bucket rather than being dropped.

export interface CourseCategory {
  department: string
  departmentName: string
  courseType: string
}

const DEPARTMENT_PREFIXES: Record<string, string> = {
  '252': 'D-INFK',
  '263': 'D-INFK',
  '401': 'D-MATH',
  '402': 'D-PHYS',
  '151': 'D-MAVT',
  '227': 'D-ITET',
  '363': 'D-MTEC',
  '351': 'D-MTEC',
  '851': 'D-GESS',
  '529': 'D-CHAB',
  '551': 'D-BIOL',
  '101': 'D-BAUG',
  '102': 'D-BAUG',
  '103': 'D-BAUG',
  '051': 'D-ARCH',
  '052': 'D-ARCH',
  '376': 'D-HEST',
  '636': 'D-BSSE',
  '651': 'D-ERDW',
  '701': 'D-USYS',
  '751': 'D-USYS',
  '327': 'D-MATL'
}

const DEPARTMENT_NAMES: Record<string, string> = {
  'D-INFK': 'Computer Science',
  'D-MATH': 'Mathematics',
  'D-PHYS': 'Physics',
  'D-MAVT': 'Mechanical and Process Engineering',
  'D-ITET': 'Information Technology and Electrical Engineering',
  'D-MTEC': 'Management, Technology, and Economics',
  'D-GESS': 'Humanities, Social and Political Sciences',
  'D-CHAB': 'Chemistry and Applied Biosciences',
  'D-BIOL': 'Biology',
  'D-BAUG': 'Civil, Environmental and Geomatic Engineering',
  'D-ARCH': 'Architecture',
  'D-HEST': 'Health Sciences and Technology',
  'D-BSSE': 'Biosystems Science and Engineering',
  'D-ERDW': 'Earth Sciences',
  'D-USYS': 'Environmental Systems Science',
  'D-MATL': 'Materials',
  Other: 'Other'
}

const COURSE_TYPES: Record<string, string> = {
  L: 'Lecture',
  G: 'Lecture + Exercises',
  U: 'Exercises',
  S: 'Seminar',
  P: 'Lab/Praktikum',
  A: 'Project Work',
  K: 'Colloquium'
}

/**
 * Derives a department and course type from an ETH course number, e.g.
 * "252-0026-00L" -> { department: 'D-INFK', departmentName: 'Computer
 * Science', courseType: 'Lecture' }.
 *
 * Never throws: any malformed or unrecognised input falls back to the
 * 'Other' bucket for both department and course type.
 */
export function categorizeCourse(courseNumber: unknown): CourseCategory {
  const other: CourseCategory = {
    department: 'Other',
    departmentName: DEPARTMENT_NAMES.Other,
    courseType: 'Other'
  }

  if (typeof courseNumber !== 'string' || courseNumber.length === 0) {
    return other
  }

  const prefix = courseNumber.slice(0, 3)
  const department = DEPARTMENT_PREFIXES[prefix] ?? 'Other'
  const departmentName = DEPARTMENT_NAMES[department] ?? DEPARTMENT_NAMES.Other

  const lastChar = courseNumber.slice(-1).toUpperCase()
  const courseType = COURSE_TYPES[lastChar] ?? 'Other'

  return { department, departmentName, courseType }
}
