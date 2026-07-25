function BarberSelection({ barbers, onSelectBarber }) {
  return (
    <section>
      <h2>Select a Barber</h2>

      {barbers.map((barber) => (
        <article key={barber.id} className="barber-card">
          <h3>{barber.name}</h3>
          <p>Specialty: {barber.specialty}</p>

          <button
            type="button"
            className="book-btn"
            onClick={() => onSelectBarber(barber)}
          >
            Book with {barber.name}
          </button>
        </article>
      ))}
    </section>
  );
}

export default BarberSelection;
