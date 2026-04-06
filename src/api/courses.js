import { apiClient } from './client';

function unwrapCoursePayload(payload) {
  if (payload && typeof payload === 'object' && 'course' in payload) {
    return payload.course;
  }

  return payload;
}

function toNumberOrFallback(value, fallback) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function normalizeCourse(payload) {
  const course = unwrapCoursePayload(payload);

  if (!course || typeof course !== 'object') {
    return course;
  }

  const id = course._id ?? course.id ?? '';
  const title = course.title ?? course.courseName ?? course.name ?? '';

  return {
    ...course,
    _id: id,
    id,
    title,
    courseName: course.courseName ?? title,
    description: course.description ?? '',
    instructor: course.instructor ?? '',
    credits: toNumberOrFallback(course.credits, 3),
    schedule: course.schedule ?? '',
    capacity: toNumberOrFallback(course.capacity, 30),
  };
}

export function serializeCoursePayload(payload) {
  return {
    ...payload,
    courseName: payload.title,
  };
}

export async function getAllCourses() {
  const { data } = await apiClient.get('/api/courses');

  if (Array.isArray(data)) {
    return data.map(normalizeCourse);
  }

  if (data && 'courses' in data) {
    return data.courses.map(normalizeCourse);
  }

  return [];
}

export async function getCourseById(id) {
  const { data } = await apiClient.get(`/api/courses/${id}`);
  return normalizeCourse(data);
}

export async function createCourse(payload) {
  const { data } = await apiClient.post('/api/courses', serializeCoursePayload(payload));
  return normalizeCourse(data);
}

export async function updateCourse(id, payload) {
  const { data } = await apiClient.put(`/api/courses/${id}`, serializeCoursePayload(payload));
  return normalizeCourse(data);
}

export async function deleteCourse(id) {
  await apiClient.delete(`/api/courses/${id}`);
}