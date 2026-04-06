import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { createCourse, deleteCourse, getAllCourses, getCourseById, updateCourse } from '../api/courses';
import { logout } from '../api/auth';
import CourseFormPanel from '../components/dashboard/CourseFormPanel';
import CourseLookupPanel from '../components/dashboard/CourseLookupPanel';
import CoursesTablePanel from '../components/dashboard/CoursesTablePanel';
import DeleteCourseModal from '../components/dashboard/DeleteCourseModal';
import SummaryCards from '../components/dashboard/SummaryCards';
import { useAuth } from '../context/AuthContext';
import {
  PAGE_SIZE,
  filterAndSortCourses,
  paginateCourses,
  summarizeCourses,
  validateCourseForm,
} from './dashboardUtils';

const defaultForm = {
  title: '',
  description: '',
  instructor: '',
  credits: 3,
  schedule: '',
  capacity: 30,
};

function extractRequestErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (typeof responseData?.message === 'string' && responseData.message.trim()) {
    return responseData.message;
  }

  if (typeof responseData?.error === 'string' && responseData.error.trim()) {
    return responseData.error;
  }

  if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
    return responseData.errors
      .map((entry) => entry?.message || entry?.msg || entry)
      .filter((entry) => typeof entry === 'string' && entry.trim())
      .join(', ');
  }

  return fallbackMessage;
}

function DashboardPage() {
  const { user, clearAuth } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [creditFilter, setCreditFilter] = useState('all');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [formData, setFormData] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [working, setWorking] = useState(false);
  const [pendingDeleteCourse, setPendingDeleteCourse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const deferredSearchText = useDeferredValue(searchText.trim().toLowerCase());

  const panelTitle = useMemo(() => (editingId ? 'Update Course' : 'Create Course'), [editingId]);

  const visibleCourses = useMemo(() => {
    return filterAndSortCourses(courses, deferredSearchText, creditFilter, sortField, sortDirection);
  }, [courses, creditFilter, deferredSearchText, sortDirection, sortField]);

  const totalPages = Math.max(1, Math.ceil(visibleCourses.length / PAGE_SIZE));

  const paginatedCourses = useMemo(() => {
    return paginateCourses(visibleCourses, currentPage, PAGE_SIZE);
  }, [currentPage, visibleCourses]);

  const summary = useMemo(() => {
    return summarizeCourses(courses);
  }, [courses]);

  const loadCourses = async () => {
    setLoadingCourses(true);

    try {
      const allCourses = await getAllCourses();
      setCourses(allCourses);
      setSelectedCourse((previous) => allCourses.find((course) => course._id === previous?._id) ?? null);
    } catch {
      toast.error('Unable to fetch courses right now.');
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [deferredSearchText, creditFilter, sortDirection, sortField]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!pendingDeleteCourse) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setPendingDeleteCourse(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [pendingDeleteCourse]);

  const handleInputChange = (key, value) => {
    setFormData((previous) => ({ ...previous, [key]: value }));
    setFormErrors((previous) => {
      if (!previous[key]) {
        return previous;
      }

      const next = { ...previous };
      delete next[key];
      return next;
    });
  };

  const resetEditor = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setFormErrors({});
  };

  const handleSubmitCourse = async (event) => {
    event.preventDefault();
    const nextErrors = validateCourseForm(formData);

    if (Object.keys(nextErrors).length > 0) {
      setFormErrors(nextErrors);
      toast.error('Please resolve the highlighted form issues.');
      return;
    }

    setWorking(true);

    try {
      if (editingId) {
        const previousCourse = courses.find((course) => course._id === editingId) || null;
        const optimisticCourse = previousCourse
          ? {
              ...previousCourse,
              ...formData,
            }
          : null;

        if (optimisticCourse) {
          setCourses((previous) => previous.map((course) => (course._id === editingId ? optimisticCourse : course)));
          setSelectedCourse((previous) => (previous?._id === editingId ? optimisticCourse : previous));
        }

        const savedCourse = await updateCourse(editingId, formData);
        setCourses((previous) => previous.map((course) => (course._id === editingId ? savedCourse : course)));
        setSelectedCourse((previous) => (previous?._id === editingId ? savedCourse : previous));
        toast.success('Course updated successfully.');
      } else {
        const optimisticId = `optimistic-${Date.now()}`;
        const optimisticCourse = {
          _id: optimisticId,
          ...formData,
        };

        setCourses((previous) => [optimisticCourse, ...previous]);
        setSelectedCourse(optimisticCourse);

        const savedCourse = await createCourse(formData);
        setCourses((previous) => [savedCourse, ...previous.filter((course) => course._id !== optimisticId)]);
        setSelectedCourse(savedCourse);
        toast.success('Course created successfully.');
      }

      resetEditor();
    } catch (error) {
      await loadCourses();
      const message = extractRequestErrorMessage(error, 'Request failed. Please verify course details.');
      toast.error(message);
    } finally {
      setWorking(false);
    }
  };

  const handleEditCourse = (course) => {
    setEditingId(course._id);
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      credits: course.credits,
      schedule: course.schedule || '',
      capacity: course.capacity || 0,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRequest = (course) => {
    setPendingDeleteCourse(course);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteCourse) {
      return;
    }

    const deletingCourse = pendingDeleteCourse;
    setWorking(true);

    try {
      setCourses((previous) => previous.filter((course) => course._id !== deletingCourse._id));
      setSelectedCourse((previous) => (previous?._id === deletingCourse._id ? null : previous));
      setPendingDeleteCourse(null);

      await deleteCourse(deletingCourse._id);
      toast.success('Course deleted.');
    } catch {
      await loadCourses();
      toast.error('Could not delete this course.');
    } finally {
      setWorking(false);
    }
  };

  const handleSearchById = async () => {
    if (!searchId.trim()) {
      toast.error('Enter a course ID first.');
      return;
    }

    setWorking(true);

    try {
      const course = await getCourseById(searchId.trim());
      setSelectedCourse(course);
      toast.success('Course loaded by ID.');
    } catch {
      setSelectedCourse(null);
      toast.error('Course not found for this ID.');
    } finally {
      setWorking(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    clearAuth();
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  const clearFilters = () => {
    setSearchText('');
    setCreditFilter('all');
    setSortField('title');
    setSortDirection('asc');
  };

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Supervisor Dashboard</p>
          <h1>Course Operations Hub</h1>
          <p className="subtitle">Manage full CRUD lifecycle for university courses.</p>
        </div>
        <div className="topbar-actions">
          <p className="user-pill">{user?.email}</p>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <SummaryCards
        totalCourses={summary.totalCourses}
        averageCredits={summary.averageCredits}
        scheduledCourses={summary.scheduledCourses}
      />

      <section className="workspace-grid">
        <CourseFormPanel
          panelTitle={panelTitle}
          formData={formData}
          formErrors={formErrors}
          editingId={editingId}
          working={working}
          onSubmit={handleSubmitCourse}
          onChange={handleInputChange}
          onCancel={resetEditor}
        />

        <CourseLookupPanel
          searchId={searchId}
          working={working}
          selectedCourse={selectedCourse}
          onSearchIdChange={setSearchId}
          onFind={handleSearchById}
          onEdit={handleEditCourse}
          onDelete={handleDeleteRequest}
        />
      </section>

      <CoursesTablePanel
        loadingCourses={loadingCourses}
        coursesCount={courses.length}
        visibleCoursesCount={visibleCourses.length}
        paginatedCourses={paginatedCourses}
        selectedCourseId={selectedCourse?._id}
        searchText={searchText}
        creditFilter={creditFilter}
        sortField={sortField}
        sortDirection={sortDirection}
        currentPage={currentPage}
        totalPages={totalPages}
        onRefresh={loadCourses}
        onSearchTextChange={setSearchText}
        onCreditFilterChange={setCreditFilter}
        onSortFieldChange={setSortField}
        onSortDirectionChange={setSortDirection}
        onSelectCourse={handleSelectCourse}
        onEditCourse={handleEditCourse}
        onDeleteCourse={handleDeleteRequest}
        onPageChange={setCurrentPage}
        onClearFilters={clearFilters}
      />

      {pendingDeleteCourse ? (
        <DeleteCourseModal
          course={pendingDeleteCourse}
          working={working}
          onCancel={() => setPendingDeleteCourse(null)}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </main>
  );
}

export default DashboardPage;
