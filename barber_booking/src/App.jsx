import { useState } from "react";
import "./App.css";

import { barbers } from "./data/barbers";
import { createBooking } from "./services/bookingService";
import { combineDateAndTime } from "./utils/dateTime";

import BarberSelection from "./components/BarberSelection";
import BookingForm from "./components/BookingForm";
import BookingConfirmation from "./components/BookingConfirmation";

function App() {
  const shopName = "Fireblade";

  const [selectedBarber, setSelectedBarber] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");

  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleBookingSubmit(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const appointmentTimestamp = combineDateAndTime(
        selectedDate,
        appointmentTime
      );

      await createBooking({
        customerName: customerName.trim(),
        barberId: selectedBarber.id,
        barberName: selectedBarber.name,
        appointmentTime: appointmentTimestamp,
      });

      setBookingConfirmed(true);
    } catch (error) {
      console.error("Database save error:", error);

      setErrorMessage(
        "Could not save your booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleCancel() {
    setSelectedBarber(null);
    setSelectedDate("");
    setAppointmentTime("");
    setErrorMessage("");
  }

  function handleReset() {
    setSelectedBarber(null);
    setCustomerName("");
    setSelectedDate("");
    setAppointmentTime("");
    setBookingConfirmed(false);
    setErrorMessage("");
  }

  let currentView;

  if (bookingConfirmed) {
    currentView = (
      <BookingConfirmation
        customerName={customerName}
        barber={selectedBarber}
        selectedDate={selectedDate}
        appointmentTime={appointmentTime}
        onReset={handleReset}
      />
    );
  } else if (selectedBarber) {
    currentView = (
      <BookingForm
        barber={selectedBarber}
        customerName={customerName}
        selectedDate={selectedDate}
        appointmentTime={appointmentTime}
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onCustomerNameChange={setCustomerName}
        onDateChange={setSelectedDate}
        onTimeChange={setAppointmentTime}
        onSubmit={handleBookingSubmit}
        onCancel={handleCancel}
      />
    );
  } else {
    currentView = (
      <BarberSelection
        barbers={barbers}
        onSelectBarber={setSelectedBarber}
      />
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>{shopName}</h1>
      </header>

      <main className="main-content">
        {currentView}
      </main>
    </div>
  );
}

export default App;