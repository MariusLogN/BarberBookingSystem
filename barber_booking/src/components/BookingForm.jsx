import { useEffect, useState } from "react";
import { getBookedIntervals } from "../services/bookingService";
import { getServicesForBarber } from "../services/serviceCatalogService";
import { doesAppointmentOverlap } from "../utils/appointmentAvailability";
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
  selectedService,
  customerName,
  customerEmail,
  selectedDate,
  appointmentTime,
  isSubmitting,
  errorMessage,
  onCustomerNameChange,
  onCustomerEmailChange,
  onServiceChange,
  onDateChange,
  onTimeChange,
  onSubmit,
  onCancel,
}) {
  const bookingDates = getNextBookingDates();
  const [services, setServices] = useState([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState("");
  const [bookedIntervals, setBookedIntervals] = useState([]);
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

    async function loadBookedIntervals() {
      setIsLoadingTimes(true);
      setTimesError("");

      try {
        const intervals = await getBookedIntervals({
          barberId: barber.id,
          date: selectedDate,
        });

        if (isRequestCurrent) {
          setBookedIntervals(intervals);
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

    loadBookedIntervals();

    return () => {
      isRequestCurrent = false;
    };
  }, [barber.id, selectedDate]);

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
          <label htmlFor="customer-email">
            Email Address (optional)
          </label>

          <input
            id="customer-email"
            type="email"
            autoComplete="email"
            value={customerEmail}
            onChange={(event) =>
              onCustomerEmailChange(event.target.value)
            }
            placeholder="e.g. mario@example.com"
          />

          <small>
            Provide an email address to receive a booking confirmation.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="service">Select Service</label>

          <select
            id="service"
            required
            value={selectedService?.id ?? ""}
            disabled={isLoadingServices || Boolean(servicesError)}
            onChange={(event) => {
              const service = services.find(
                (item) => String(item.id) === event.target.value
              );

              onServiceChange(service ?? null);
              onTimeChange("");
            }}
          >
            <option value="">
              {isLoadingServices
                ? "Loading services..."
                : "Choose a service"}
            </option>

            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} — {service.duration_minutes} min — €
                {(service.price_cents / 100).toFixed(2)}
              </option>
            ))}
          </select>

          {servicesError && (
            <p className="error-banner" role="alert">
              {servicesError}
            </p>
          )}
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
              {bookedIntervals.length === 0 && (
                <p>All times are currently available.</p>
              )}
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
              !selectedService
              || !selectedDate
              || isLoadingTimes
              || Boolean(timesError)
            }
            onChange={(event) =>
              onTimeChange(event.target.value)
            }
          >
            <option value="">Choose a time</option>
            {appointmentTimes.map((time) => {
              const isUnavailable = selectedService
                ? doesAppointmentOverlap({
                    date: selectedDate,
                    time: time.value,
                    durationMinutes:
                      selectedService.duration_minutes,
                    bookedIntervals,
                  })
                : false;

              return (
                <option
                  key={time.value}
                  value={time.value}
                  disabled={isUnavailable}
                >
                  {time.label}
                  {isUnavailable ? " — unavailable" : ""}
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
