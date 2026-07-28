import { useEffect, useState } from "react";
import { getBookedTimes } from "../services/bookingService";
import { getServicesForBarber } from "../services/serviceCatalogService";
import { getNextBookingDates } from "../utils/bookingDates";

const appointmentTimes = [
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "13:30", label: "01:30 PM" },
  { value: "14:00", label: "02:00 PM" },
];

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
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState("");
  const [bookedTimes, setBookedTimes] = useState([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [timesError, setTimesError] = useState("");

  useEffect(() => {
    let isRequestCurrent = true;

    async function loadServices() {
      try {
        const barberServices = await getServicesForBarber(barber.id);

        if (isRequestCurrent) {
          setServices(barberServices);
        }
      } catch (error) {
        console.error("Services load error:", error);

        if (isRequestCurrent) {
          setServicesError("Could not load services.");
        }
      } finally {
        if (isRequestCurrent) {
          setIsLoadingServices(false);
        }
      }
    }

    loadServices();

    return () => {
      isRequestCurrent = false;
    };
  }, [barber.id]);

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    let isRequestCurrent = true;

    async function loadBookedTimes() {
      setIsLoadingTimes(true);
      setTimesError("");

      try {
        const times = await getBookedTimes({
          barberId: barber.id,
          date: selectedDate,
        });

        if (isRequestCurrent) {
          setBookedTimes(times);
        }
      } catch (error) {
        console.error("Availability load error:", error);

        if (isRequestCurrent) {
          setTimesError("Could not check availability.");
        }
      } finally {
        if (isRequestCurrent) {
          setIsLoadingTimes(false);
        }
      }
    }

    loadBookedTimes();

    return () => {
      isRequestCurrent = false;
    };
  }, [barber.id, selectedDate]);

  return (
    <section className="booking-form-card">
      <h2>Book with {barber.name}</h2>

      {isLoadingServices && <p>Loading services...</p>}

      {servicesError && (
        <p className="error-banner" role="alert">
          {servicesError}
        </p>
      )}

      {!isLoadingServices && !servicesError && (
        <p>{services.length} service(s) available.</p>
      )}

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
            onChange={(event) => {
              onDateChange(event.target.value);
              onTimeChange("");
            }}
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

          {isLoadingTimes && <p>Checking availability...</p>}

          {timesError && (
            <p className="error-banner" role="alert">
              {timesError}
            </p>
          )}

          {!isLoadingTimes && !timesError && selectedDate && (
            <p>
              {bookedTimes.length === 0
                ? "All times are currently available."
                : `${bookedTimes.length} time slot(s) already booked.`}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="appointment-time">
            Select Time
          </label>

          <select
            id="appointment-time"
            required
            value={appointmentTime}
            disabled={
              !selectedDate || isLoadingTimes || Boolean(timesError)
            }
            onChange={(event) =>
              onTimeChange(event.target.value)
            }
          >
            <option value="">Choose a time</option>
            {appointmentTimes.map((time) => {
              const isBooked = bookedTimes.includes(time.value);

              return (
                <option
                  key={time.value}
                  value={time.value}
                  disabled={isBooked}
                >
                  {time.label}
                  {isBooked ? " — unavailable" : ""}
                </option>
              );
            })}
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
