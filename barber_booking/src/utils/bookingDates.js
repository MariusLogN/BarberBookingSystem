function formatDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getNextBookingDates(numberOfDays = 7) {
  const bookingDates = [];
  const today = new Date();

  for (let dayOffset = 0; dayOffset < numberOfDays; dayOffset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);

    bookingDates.push({
      value: formatDateValue(date),
      label: new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(date),
    });
  }

  return bookingDates;
}
