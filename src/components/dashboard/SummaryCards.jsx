function SummaryCards({ totalCourses, averageCredits, scheduledCourses }) {
  return (
    <section className="summary-grid">
      <article className="summary-card">
        <span className="summary-label">Total Courses</span>
        <strong>{totalCourses}</strong>
      </article>
      <article className="summary-card">
        <span className="summary-label">Average Credits</span>
        <strong>{averageCredits}</strong>
      </article>
      <article className="summary-card">
        <span className="summary-label">Scheduled Courses</span>
        <strong>{scheduledCourses}</strong>
      </article>
    </section>
  );
}

export default SummaryCards;
