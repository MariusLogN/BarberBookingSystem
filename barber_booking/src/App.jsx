import { useState } from 'react';
import { supabase } from './supabaseClient'; // superbase client
import './App.css';

function App() {
  const shopName = "Fireblade";

  // State variables
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  
  // Loading & error states for UX feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const barbers = [
    { id: 1, name: "Alex Rivera", specialty: "Skin Fades & Beard Trims" },
    { id: 2, name: "Jordan Lee", specialty: "Classic Cuts & Scissors Work" }
  ];

  //Save booking directly into Supabase database
  const handleBookingSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Insert new row into the 'bookings' table
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            customer_name: customerName,
            barber_name: selectedBarber,
            appointment_time: appointmentTime
          }
        ]);

      if (error) {
        throw error;
      }

      console.log("Newly saved booking: ", data)

      

      // If database insert succeeded
      setBookingConfirmed(true);

      
    } catch (error) {
      console.error("Database Save Error:", error);
      setErrorMessage("Could not save your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedBarber(null);
    setCustomerName("");
    setAppointmentTime("");
    setBookingConfirmed(false);
    setErrorMessage("");
  };

  return (
    <div className="container">
      <header className="header">
        <h1>{shopName}</h1>
      </header>

      <main className="main-content">
        {/* VIEW 1: Booking Confirmation */}
        {bookingConfirmed ? (
          <div className="confirmation-card">
            <h2>🎉 Booking Confirmed & Saved!</h2>
            <p>Thank you, <strong>{customerName}</strong>.</p>
            <p>Your appointment with <strong>{selectedBarber}</strong> is locked in for <strong>{appointmentTime}</strong>.</p>
            <button className="book-btn" onClick={handleReset}>Book Another</button>
          </div>
        ) : selectedBarber ? (
          /* VIEW 2: Booking Form */
          <div className="booking-form-card">
            <h3>Book with {selectedBarber}</h3>

            {errorMessage && <p className="error-banner">{errorMessage}</p>}

            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label>Your Name:</label>
                <input 
                  type="text" 
                  required 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  placeholder="e.g. John Doe" 
                />
              </div>

              <div className="form-group">
                <label>Select Time:</label>
                <select 
                  required 
                  value={appointmentTime} 
                  onChange={(e) => setAppointmentTime(e.target.value)}
                >
                  <option value="">-- Choose a Slot --</option>
                  <option value="2026-07-25T10:00:00Z">Today at 10:00 AM</option>
                  <option value="2026-07-25T11:30:00Z">Today at 11:30 AM</option>
                  <option value="2026-07-25T14:00:00Z">Today at 02:00 PM</option>
                </select>
              </div>

              <div className="button-group">
                <button type="submit" className="book-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Confirm Booking"}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setSelectedBarber(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* VIEW 3: Barber Selection List */
          <div>
            <h2>Select a Barber</h2>
            {barbers.map((barber) => (
              <div key={barber.id} className="barber-card">
                <h3>{barber.name}</h3>
                <p>Specialty: {barber.specialty}</p>
                <button 
                  className="book-btn" 
                  onClick={() => setSelectedBarber(barber.name)}
                >
                  Book with {barber.name}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;