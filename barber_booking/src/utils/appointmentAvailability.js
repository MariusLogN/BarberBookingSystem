const MILLISECONDS_PER_MINUTE = 60 * 1000;

export function doesAppointmentOverlap({
  date,
  time,
  durationMinutes,
  bookedIntervals,
}) {
  const candidateStart = new Date(`${date}T${time}:00`);
  const candidateEnd = new Date(
    candidateStart.getTime()
      + durationMinutes * MILLISECONDS_PER_MINUTE
  );

  return bookedIntervals.some((bookedInterval) => {
    const bookedStart = new Date(bookedInterval.start);
    const bookedEnd = new Date(bookedInterval.end);

    return candidateStart < bookedEnd && candidateEnd > bookedStart;
  });
}
