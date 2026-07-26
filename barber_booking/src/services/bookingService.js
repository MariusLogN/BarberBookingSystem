import { supabase } from "../supabaseClient";

function getFollowingDate(date) {
  const followingDate = new Date(`${date}T00:00:00`);
  followingDate.setDate(followingDate.getDate() + 1);

  const year = followingDate.getFullYear();
  const month = String(followingDate.getMonth() + 1).padStart(2, "0");
  const day = String(followingDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function getBookedTimes({ barberId, date }) {
  const startOfDate = `${date}T00:00:00`;
  const startOfFollowingDate = `${getFollowingDate(date)}T00:00:00`;

  const { data, error } = await supabase
    .from("booked_slots")
    .select("appointment_time")
    .eq("barber_id", barberId)
    .gte("appointment_time", startOfDate)
    .lt("appointment_time", startOfFollowingDate);

  if (error) {
    throw error;
  }

  return data.map((booking) =>
    booking.appointment_time.slice(11, 16)
  );
}

export async function createBooking({
  customerName,
  barberId,
  barberName,
  appointmentTime,
}) {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      customer_name: customerName,
      barber_name: barberName,
      barber_id: barberId,
      appointment_time: appointmentTime,
    });

  if (error) {
    throw error;
  }

  return data;
}
