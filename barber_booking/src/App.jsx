import { useState } from 'react';
import { supabase } from './supabaseClient'
import './App.css';


function App() {
  //Core thins
  const shopName = "FireBlade";


  //selected barber
  const [selectedBarber, setSelectedBarber] = useState(null)

  //list of barbers
  const barbers = [
    {id: 1, name: "Marius Hansen", specialty: "Barber Apprentice"},
    {id: 2, name:"John Jøgersen", specialty: "Qualified Barber"},
    
  ];

  //form input
  const [customerName, setCustomerName] = useState("");
  const [appointmentTime, setAppointmentTime] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  //bookingform handler
  const handleBookingSubmit = (event) => {
    event.preventDefault(); // Prevents page reload on form submit
    setBookingConfirmed(true);
  };

  //reset booking. TO start new booking
  const handleReset = () => {
    setSelectedBarber(null);
    setCustomerName("");
    setAppointmentTime("");
    setBookingConfirmed(false);
  };



return (
    <div className="container">
      <header className="header">
        <h1>{shopName}</h1>
      </header>

      <main className="main-content">
        {/* VIEW 1: Show Confirmation Message */}
        {bookingConfirmed ? (
          <div className="confirmation-card">
            <h2>🎉 Booking Confirmed!</h2>
            <p>Thank you, <strong>{customerName}</strong>.</p>
            <p>Your appointment with <strong>{selectedBarber}</strong> is set for <strong>{appointmentTime}</strong>.</p>
            <button className="book-btn" onClick={handleReset}>Book Another</button>
          </div>
        ) : selectedBarber ? (
          /* VIEW 2: Show Booking Form when a barber is selected */
          <div className="booking-form-card">
            <h3>Book with {selectedBarber}</h3>
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
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                </select>
              </div>

              <div className="button-group">
                <button type="submit" className="book-btn">Confirm Booking</button>
                <button type="button" className="cancel-btn" onClick={() => setSelectedBarber(null)}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          /* VIEW 3: Show Barber List when no barber is selected */
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