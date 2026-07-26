import { supabase } from "../supabaseClient";

export async function getBarbers() {
  const { data, error } = await supabase
    .from("barbers")
    .select("id, name, specialty")
    .order("name");

  if (error) {
    throw error;
  }

  return data;
}
