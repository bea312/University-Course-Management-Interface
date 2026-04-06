import { describe, expect, it } from 'vitest';
import { filterAndSortCourses, paginateCourses, summarizeCourses, validateCourseForm } from './dashboardUtils';

const sampleCourses = [
  {
    _id: 'course-1',
    title: 'Algebra I',
    description: 'Introductory mathematics course for first year students.',
    instructor: 'Dr. Hani',
    credits: 2,
    schedule: 'Mon 09:00',
    capacity: 30,
  },
  {
    _id: 'course-2',
    title: 'Data Structures',
    description: 'Core software engineering course covering trees and graphs.',
    instructor: 'Prof. Mona',
    credits: 4,
    schedule: 'Tue 11:00',
    capacity: 45,
  },
  {
    _id: 'course-3',
    title: 'Advanced Networks',
    description: 'High-level networking concepts and routing strategies.',
    instructor: 'Dr. Kareem',
    credits: 5,
    schedule: '',
    capacity: 20,
  },
];

describe('dashboardUtils', () => {
  it('filters and sorts courses by search and credit rules', () => {
    const result = filterAndSortCourses(sampleCourses, 'data', 'standard', 'title', 'asc');

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Data Structures');
  });

  it('paginates courses correctly', () => {
    const result = paginateCourses(sampleCourses, 2, 2);

    expect(result).toHaveLength(1);
    expect(result[0]._id).toBe('course-3');
  });

  it('summarizes course counts and average credits', () => {
    const result = summarizeCourses(sampleCourses);

    expect(result.totalCourses).toBe(3);
    expect(result.averageCredits).toBe('3.7');
    expect(result.scheduledCourses).toBe(2);
  });

  it('validates invalid course form data', () => {
    const invalidPayload = {
      title: ' ',
      description: 'short',
      instructor: ' ',
      credits: 0,
      schedule: 'MW',
      capacity: 0,
    };

    const result = validateCourseForm(invalidPayload);

    expect(result.title).toBeDefined();
    expect(result.description).toBeDefined();
    expect(result.instructor).toBeDefined();
    expect(result.credits).toBeDefined();
    expect(result.schedule).toBeDefined();
    expect(result.capacity).toBeDefined();
  });
});