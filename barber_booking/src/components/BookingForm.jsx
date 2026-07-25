function BookingForm({
  barber,
  customerName,
  selectedDate,
  appointmentTime,
  isSubmitting,
  errorMessage,
  onCustomerNameChange,
  onDateChange,
  onTimeChange,
  onSubmit,
  onCancel,
}) {
  return (
    <section className="booking-form-card">
      <h2>Book with {barber.name}</h2>

      {errorMessage && (
        <p className="error-banner" role="alert">
          {errorMessage}
        </p>
      )}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="customer-name">Your Name</label>

          <input
            id="customer-name"
            type="text"
            required
            value={customerName}
            onChange={(event) =>
              onCustomerNameChange(event.target.value)
            }
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="form-group">
          <label htmlFor="appointment-date">
            Select Date
          </label>

          <select
            id="appointment-date"
            required
            value={selectedDate}
            onChange={(event) =>
              onDateChange(event.target.value)
            }
          >
            <option value="">Choose a date</option>
            <option value="2026-07-25">July 25</option>
            <option value="2026-07-26">July 26</option>
            <option value="2026-07-27">July 27</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="appointment-time">
            Select Time
          </label>

          <select
            id="appointment-time"
            required
            value={appointmentTime}
            onChange={(event) =>
              onTimeChange(event.target.value)
            }
          >
            <option value="">Choose a time</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:30">11:30 AM</option>
            <option value="14:00">2:00 PM</option>
          </select>
        </div>

        <div className="button-group">
          <button
            type="submit"
            className="book-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Confirm Booking"}
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}

export default BookingForm;