function CourseFormPanel({
  panelTitle,
  formData,
  formErrors,
  editingId,
  working,
  onSubmit,
  onChange,
  onCancel,
}) {
  return (
    <article className="panel">
      <h2>{panelTitle}</h2>
      <form className="crud-form" onSubmit={onSubmit}>
        <label>
          Title
          <input
            value={formData.title}
            onChange={(event) => onChange('title', event.target.value)}
            aria-invalid={Boolean(formErrors.title)}
            required
          />
          {formErrors.title ? <span className="field-error">{formErrors.title}</span> : null}
        </label>
        <label>
          Description
          <textarea
            rows={3}
            value={formData.description}
            onChange={(event) => onChange('description', event.target.value)}
            aria-invalid={Boolean(formErrors.description)}
            required
          />
          {formErrors.description ? <span className="field-error">{formErrors.description}</span> : null}
        </label>
        <label>
          Instructor
          <input
            value={formData.instructor}
            onChange={(event) => onChange('instructor', event.target.value)}
            aria-invalid={Boolean(formErrors.instructor)}
            required
          />
          {formErrors.instructor ? <span className="field-error">{formErrors.instructor}</span> : null}
        </label>
        <label>
          Credits
          <input
            type="number"
            min={1}
            value={formData.credits}
            onChange={(event) => onChange('credits', Number(event.target.value))}
            aria-invalid={Boolean(formErrors.credits)}
            required
          />
          {formErrors.credits ? <span className="field-error">{formErrors.credits}</span> : null}
        </label>
        <label>
          Schedule
          <input
            value={formData.schedule}
            onChange={(event) => onChange('schedule', event.target.value)}
            aria-invalid={Boolean(formErrors.schedule)}
          />
          {formErrors.schedule ? <span className="field-error">{formErrors.schedule}</span> : null}
        </label>
        <label>
          Capacity
          <input
            type="number"
            min={1}
            value={formData.capacity}
            onChange={(event) => onChange('capacity', Number(event.target.value))}
            aria-invalid={Boolean(formErrors.capacity)}
          />
          {formErrors.capacity ? <span className="field-error">{formErrors.capacity}</span> : null}
        </label>
        <div className="button-row">
          <button className="btn btn-primary" disabled={working} type="submit">
            {working ? 'Saving...' : editingId ? 'Save Changes' : 'Create Course'}
          </button>
          {editingId ? (
            <button className="btn btn-ghost" type="button" onClick={onCancel}>
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>
    </article>
  );
}

export default CourseFormPanel;
