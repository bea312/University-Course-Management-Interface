import { SearchX } from 'lucide-react';

function CoursesTablePanel({
  loadingCourses,
  coursesCount,
  visibleCoursesCount,
  paginatedCourses,
  selectedCourseId,
  searchText,
  creditFilter,
  sortField,
  sortDirection,
  currentPage,
  totalPages,
  onRefresh,
  onSearchTextChange,
  onCreditFilterChange,
  onSortFieldChange,
  onSortDirectionChange,
  onSelectCourse,
  onEditCourse,
  onDeleteCourse,
  onPageChange,
  onClearFilters,
}) {
  const showFilteredEmptyState = !loadingCourses && coursesCount > 0 && visibleCoursesCount === 0;

  return (
    <section className="panel">
      <div className="table-header">
        <div>
          <h2>All Courses</h2>
          <p className="section-copy">Search, filter, and sort the catalog before selecting a course to inspect or edit.</p>
        </div>
        <div className="table-header-actions">
          <button className="btn btn-ghost" type="button" onClick={onRefresh} disabled={loadingCourses}>
            {loadingCourses ? 'Refreshing...' : 'Refresh List'}
          </button>
        </div>
      </div>

      <div className="toolbar-grid">
        <label>
          Search
          <input
            placeholder="Search title, instructor, description, or ID"
            value={searchText}
            onChange={(event) => onSearchTextChange(event.target.value)}
          />
        </label>
        <label>
          Credit Filter
          <select value={creditFilter} onChange={(event) => onCreditFilterChange(event.target.value)}>
            <option value="all">All Credits</option>
            <option value="light">1-2 Credits</option>
            <option value="standard">3-4 Credits</option>
            <option value="heavy">5+ Credits</option>
          </select>
        </label>
        <label>
          Sort Field
          <select value={sortField} onChange={(event) => onSortFieldChange(event.target.value)}>
            <option value="title">Title</option>
            <option value="credits">Credits</option>
            <option value="capacity">Capacity</option>
          </select>
        </label>
        <label>
          Direction
          <select value={sortDirection} onChange={(event) => onSortDirectionChange(event.target.value)}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {loadingCourses ? <p className="empty-state">Loading courses...</p> : null}

      {showFilteredEmptyState ? (
        <div className="empty-illustration-card">
          <div className="empty-illustration-icon">
            <SearchX size={28} />
          </div>
          <h3>No courses match these filters</h3>
          <p className="section-copy">
            Your course catalog exists, but the current search and filter combination produced zero matches.
          </p>
          <button className="btn btn-ghost" type="button" onClick={onClearFilters}>
            Clear Filters
          </button>
        </div>
      ) : null}

      {!loadingCourses && coursesCount === 0 ? <p className="empty-state">No courses available.</p> : null}

      {!loadingCourses && visibleCoursesCount > 0 ? (
        <>
          <div className="result-meta">
            <span>Showing {paginatedCourses.length} of {visibleCoursesCount} filtered courses</span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Instructor</th>
                  <th>Credits</th>
                  <th>Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourses.map((course) => (
                  <tr
                    key={course._id}
                    className={selectedCourseId === course._id ? 'row-selected' : undefined}
                    onClick={() => onSelectCourse(course)}
                  >
                    <td>{course.title}</td>
                    <td>{course.instructor}</td>
                    <td>{course.credits}</td>
                    <td>{course.capacity ?? 'N/A'}</td>
                    <td className="actions">
                      <button
                        className="btn btn-ghost"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onEditCourse(course);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onDeleteCourse(course);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination-bar">
            <button
              className="btn btn-ghost"
              type="button"
              disabled={currentPage === 1}
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            >
              Previous
            </button>
            <div className="page-chip-row">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  className={page === currentPage ? 'page-chip page-chip-active' : 'page-chip'}
                  type="button"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="btn btn-ghost"
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            >
              Next
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
}

export default CoursesTablePanel;
