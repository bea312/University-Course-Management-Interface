function DeleteCourseModal({ course, working, onCancel, onConfirm }) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="delete-course-title">
        <p className="eyebrow">Confirm Deletion</p>
        <h2 id="delete-course-title">Remove {course.title}?</h2>
        <p className="section-copy">
          This will permanently delete the course record from the system. Review the course title and confirm.
        </p>
        <p className="modal-hint">Press Escape or click outside this panel to cancel.</p>
        <div className="modal-review">
          <span>{course._id}</span>
          <strong>{course.instructor}</strong>
        </div>
        <div className="button-row">
          <button className="btn btn-danger" type="button" disabled={working} onClick={onConfirm}>
            {working ? 'Removing...' : 'Yes, Delete'}
          </button>
          <button className="btn btn-ghost" type="button" disabled={working} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteCourseModal;
