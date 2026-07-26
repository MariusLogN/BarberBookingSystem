import { getNextBookingDates } from "../utils/bookingDates";

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
  const bookingDates = getNextBookingDates();

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
            {bookingDates.map((bookingDate) => (
              <option
                key={bookingDate.value}
                value={bookingDate.value}
              >
                {bookingDate.label}
              </option>
            ))}
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
            <option value="10:30">10:30 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="11:30">11:30 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="12:30">12:30 PM</option>
            <option value="13:00">01:00 PM</option>
            <option value="13:30">01:30 PM</option>
            <option value="14:00">02:00 PM</option>

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
