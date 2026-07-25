import { supabase } from "../supabaseClient";

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