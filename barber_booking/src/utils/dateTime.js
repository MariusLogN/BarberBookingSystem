export function combineDateAndTime(date, time) {
  if (!date || !time) {
    throw new Error("Date and time are required.");
  }

  const localDateTime = `${date}T${time}:00`;
  const parsedDate = new Date(localDateTime);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid appointment date or time.");
  }

  return localDateTime;
}
