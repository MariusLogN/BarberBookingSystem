import { supabase } from "../supabaseClient";
import { FunctionsHttpError } from "@supabase/supabase-js";

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

export async function getBookedIntervals({ barberId, date }) {
  const startOfDate = `${date}T00:00:00`;
  const startOfFollowingDate = `${getFollowingDate(date)}T00:00:00`;

  const { data, error } = await supabase
    .from("booked_slots")
    .select("appointment_time, appointment_end")
    .eq("barber_id", barberId)
    .gte("appointment_time", startOfDate)
    .lt("appointment_time", startOfFollowingDate);

  if (error) {
    throw error;
  }

  return data.map((booking) => ({
    start: booking.appointment_time,
    end: booking.appointment_end,
  }));
}

export async function createBooking({
  customerName,
  customerEmail,
  barberId,
  serviceId,
  appointmentTime,
}) {
  const { data, error } = await supabase.functions.invoke(
    "create-booking",
    {
      body: {
        customerName,
        customerEmail,
        barberId,
        serviceId,
        appointmentTime,
      },
    }
  );

  if (error instanceof FunctionsHttpError) {
    const responseBody = await error.context.json();

    const functionError = new Error(
      responseBody.error ?? "Could not create the booking."
    );

    functionError.status = error.context.status;
    throw functionError;
  }

  if (error) {
    throw error;
  }

  return data.booking;
}
