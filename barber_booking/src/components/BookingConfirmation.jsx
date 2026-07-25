function BookingConfirmation({
  customerName,
  barber,
  appointmentTime,
  selectedDate,
  onReset,
}) {
  return (
    <section className="confirmation-card">
      <h2>Booking confirmed!</h2>

      <p>
        Thank you, <strong>{customerName}</strong>.
      </p>

      <p>
        Your appointment with{" "}
        <strong>{barber.name}</strong> is booked for{" "}
        <strong>
          {selectedDate} at {appointmentTime}
        </strong>
        .
      </p>

      <button
        type="button"
        className="book-btn"
        onClick={onReset}
      >
        Book Another
      </button>
    </section>
  );
}

export default BookingConfirmation;