function CourseLookupPanel({
  searchId,
  working,
  selectedCourse,
  onSearchIdChange,
  onFind,
  onEdit,
  onDelete,
}) {
  return (
    <article className="panel">
      <div className="panel-heading">
        <div>
          <h2>Course Lookup</h2>
          <p className="section-copy">Pull a course directly by ID or inspect a selected course in detail.</p>
        </div>
      </div>
      <div className="search-row">
        <input placeholder="Enter course ID" value={searchId} onChange={(event) => onSearchIdChange(event.target.value)} />
        <button className="btn btn-primary" type="button" onClick={onFind} disabled={working}>
          Find
        </button>
      </div>

      {selectedCourse ? (
        <div className="course-detail">
          <div className="course-detail-header">
            <div>
              <p className="eyebrow">Selected Course</p>
              <h3>{selectedCourse.title}</h3>
            </div>
            <span className="detail-chip">{selectedCourse.credits} Credits</span>
          </div>
          <p>{selectedCourse.description}</p>
          <div className="detail-grid">
            <div>
              <span className="detail-label">ID</span>
              <strong>{selectedCourse._id}</strong>
            </div>
            <div>
              <span className="detail-label">Instructor</span>
              <strong>{selectedCourse.instructor}</strong>
            </div>
            <div>
              <span className="detail-label">Schedule</span>
              <strong>{selectedCourse.schedule || 'Not assigned'}</strong>
            </div>
            <div>
              <span className="detail-label">Capacity</span>
              <strong>{selectedCourse.capacity ?? 'N/A'}</strong>
            </div>
          </div>
          <div className="button-row">
            <button className="btn btn-ghost" type="button" onClick={() => onEdit(selectedCourse)}>
              Edit From Detail
            </button>
            <button className="btn btn-danger" type="button" onClick={() => onDelete(selectedCourse)}>
              Remove Course
            </button>
          </div>
        </div>
      ) : (
        <p className="empty-state">No course selected yet.</p>
      )}
    </article>
  );
}

export default CourseLookupPanel;
