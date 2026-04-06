import { describe, expect, it } from 'vitest';
import { normalizeCourse, serializeCoursePayload } from './courses';

describe('course api adapters', () => {
  it('normalizes backend course fields into the dashboard shape', () => {
    const result = normalizeCourse({
      id: 'course-42',
      courseName: 'Distributed Systems',
      description: 'Covers replication and consensus.',
    });

    expect(result._id).toBe('course-42');
    expect(result.id).toBe('course-42');
    expect(result.title).toBe('Distributed Systems');
    expect(result.courseName).toBe('Distributed Systems');
    expect(result.instructor).toBe('');
    expect(result.credits).toBe(3);
    expect(result.capacity).toBe(30);
  });

  it('serializes dashboard form data with courseName for the backend', () => {
    const payload = {
      title: 'Operating Systems',
      description: 'Processes, threads, and memory.',
      instructor: 'Dr. Amal',
      credits: 4,
      schedule: 'Wed 14:00',
      capacity: 35,
    };

    const result = serializeCoursePayload(payload);

    expect(result.courseName).toBe('Operating Systems');
    expect(result.title).toBe('Operating Systems');
    expect(result.description).toBe(payload.description);
  });
});