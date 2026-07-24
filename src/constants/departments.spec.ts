import { describe, expect, it } from 'vitest'
import { categorizeCourse } from './departments'

describe('categorizeCourse', () => {
  it('maps a known course number to its department and course type', () => {
    const result = categorizeCourse('252-0026-00L')
    expect(result.department).toBe('D-INFK')
    expect(result.departmentName).toBe('Computer Science')
    expect(result.courseType).toBe('Lecture')
  })

  it('recognises different course-type suffixes', () => {
    expect(categorizeCourse('401-0000-00G').courseType).toBe('Lecture + Exercises')
    expect(categorizeCourse('401-0000-00U').courseType).toBe('Exercises')
    expect(categorizeCourse('401-0000-00S').courseType).toBe('Seminar')
    expect(categorizeCourse('401-0000-00P').courseType).toBe('Lab/Praktikum')
    expect(categorizeCourse('401-0000-00A').courseType).toBe('Project Work')
    expect(categorizeCourse('401-0000-00K').courseType).toBe('Colloquium')
  })

  it('falls back to Other for an unrecognised prefix', () => {
    const result = categorizeCourse('999-9999-99L')
    expect(result.department).toBe('Other')
    expect(result.departmentName).toBe('Other')
  })

  it('falls back to Other for an unrecognised trailing character', () => {
    const result = categorizeCourse('252-0026-00X')
    expect(result.courseType).toBe('Other')
  })

  it('never throws on malformed input', () => {
    expect(() => categorizeCourse('')).not.toThrow()
    expect(() => categorizeCourse('abc')).not.toThrow()
    expect(() => categorizeCourse(null)).not.toThrow()
    expect(() => categorizeCourse(undefined)).not.toThrow()
    expect(() => categorizeCourse(12345)).not.toThrow()

    const malformed = categorizeCourse('x')
    expect(malformed.department).toBe('Other')
    expect(malformed.courseType).toBe('Other')
  })
})
