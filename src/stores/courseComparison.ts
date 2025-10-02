import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface CourseSelection {
  courseNumber: string
  courseName: string
}

export const useCourseComparisonStore = defineStore('courseComparison', () => {

  const STORAGE_KEY = 'courseComparison_selectedCourses'

  const loadFromStorage = (): CourseSelection[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.warn('Failed to load course comparison data from localStorage:', error)
      return []
    }
  }

  const saveToStorage = (courses: CourseSelection[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses))
    } catch (error) {
      console.warn('Failed to save course comparison data to localStorage:', error)
    }
  }

  const MAX_COURSES = 5

  const selectedCourses = ref<CourseSelection[]>(loadFromStorage())
  const canAddMoreCourses = computed(() => selectedCourses.value.length < MAX_COURSES)
  const hasSelectedCourses = computed(() => selectedCourses.value.length > 0)
  const selectedCoursesCount = computed(() => selectedCourses.value.length)

  function isCourseSelected(courseNumber: string): boolean {
    return selectedCourses.value.some(course => course.courseNumber === courseNumber)
  }

  function addCourse(courseNumber: string, courseName: string) {
    if (!canAddMoreCourses.value) {
      console.warn('Cannot add more courses. Maximum limit reached.')
      return false
    }

    if (isCourseSelected(courseNumber)) {
      console.warn('Course already selected for comparison.')
      return false
    }

    selectedCourses.value.push({ courseNumber, courseName })
    saveToStorage(selectedCourses.value)
    return true
  }

  function removeCourse(courseNumber: string) {
    const index = selectedCourses.value.findIndex(course => course.courseNumber === courseNumber)
    if (index >= 0) {
      selectedCourses.value.splice(index, 1)
      saveToStorage(selectedCourses.value)
      return true
    }
    return false
  }

  function toggleCourse(courseNumber: string, courseName: string) {
    if (isCourseSelected(courseNumber)) {
      return removeCourse(courseNumber)
    } else {
      return addCourse(courseNumber, courseName)
    }
  }

  function clearSelection() {
    selectedCourses.value = []
    saveToStorage(selectedCourses.value)
  }

  return {
    selectedCourses,
    canAddMoreCourses,
    hasSelectedCourses,
    selectedCoursesCount,
    isCourseSelected,
    addCourse,
    removeCourse,
    toggleCourse,
    clearSelection,
    MAX_COURSES
  }
})