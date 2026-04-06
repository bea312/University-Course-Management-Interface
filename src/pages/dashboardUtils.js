export const PAGE_SIZE = 6;

export function filterAndSortCourses(courses, searchText, creditFilter, sortField, sortDirection) {
  const normalizedSearch = searchText.trim().toLowerCase();

  const filtered = courses.filter((course) => {
    const matchesText =
      normalizedSearch.length === 0 ||
      [course.title, course.description, course.instructor, course.schedule, course._id]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedSearch));

    const matchesCredits =
      creditFilter === 'all' ||
      (creditFilter === 'light' && course.credits <= 2) ||
      (creditFilter === 'standard' && course.credits >= 3 && course.credits <= 4) ||
      (creditFilter === 'heavy' && course.credits >= 5);

    return matchesText && matchesCredits;
  });

  return [...filtered].sort((left, right) => {
    const leftValue = sortField === 'title' ? (left.title ?? '').toLowerCase() : (left[sortField] ?? 0);
    const rightValue = sortField === 'title' ? (right.title ?? '').toLowerCase() : (right[sortField] ?? 0);

    if (leftValue < rightValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }

    if (leftValue > rightValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }

    return 0;
  });
}

export function paginateCourses(courses, currentPage, pageSize = PAGE_SIZE) {
  const startIndex = (currentPage - 1) * pageSize;
  return courses.slice(startIndex, startIndex + pageSize);
}

export function summarizeCourses(courses) {
  const totalCourses = courses.length;
  const averageCredits =
    totalCourses === 0
      ? 0
      : courses.reduce((sum, course) => sum + (course.credits ?? 0), 0) / totalCourses;
  const scheduledCourses = courses.filter(
    (course) => course.schedule && course.schedule.trim().length > 0,
  ).length;

  return {
    totalCourses,
    averageCredits: averageCredits.toFixed(1),
    scheduledCourses,
  };
}

export function validateCourseForm(payload) {
  const nextErrors = {};

  if (!payload.title.trim()) {
    nextErrors.title = 'Title is required.';
  }

  if (payload.description.trim().length < 12) {
    nextErrors.description = 'Description must be at least 12 characters.';
  }

  if (!payload.instructor.trim()) {
    nextErrors.instructor = 'Instructor name is required.';
  }

  if (!Number.isFinite(payload.credits) || payload.credits < 1 || payload.credits > 12) {
    nextErrors.credits = 'Credits must be between 1 and 12.';
  }

  if (payload.capacity !== undefined && payload.capacity !== null) {
    if (!Number.isFinite(payload.capacity) || payload.capacity < 1) {
      nextErrors.capacity = 'Capacity must be at least 1.';
    }
  }

  if (payload.schedule && payload.schedule.trim().length > 0 && payload.schedule.trim().length < 4) {
    nextErrors.schedule = 'Schedule must be descriptive or left empty.';
  }

  return nextErrors;
}
