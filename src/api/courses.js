import { apiClient } from './client';

function unwrapCoursePayload(payload) {
  if (payload && typeof payload === 'object' && 'course' in payload) {
    return payload.course;
  }

  return payload;
}

export async function getAllCourses() {
  const { data } = await apiClient.get('/api/courses');

  if (Array.isArray(data)) {
    return data;
  }

  if (data && 'courses' in data) {
    return data.courses;
  }

  return [];
}

export async function getCourseById(id) {
  const { data } = await apiClient.get(`/api/courses/${id}`);
  return unwrapCoursePayload(data);
}

export async function createCourse(payload) {
  const { data } = await apiClient.post('/api/courses', payload);
  return unwrapCoursePayload(data);
}

export async function updateCourse(id, payload) {
  const { data } = await apiClient.put(`/api/courses/${id}`, payload);
  return unwrapCoursePayload(data);
}

export async function deleteCourse(id) {
  await apiClient.delete(`/api/courses/${id}`);
}