import { supabase } from "../supabaseClient";

export async function getServicesForBarber(barberId) {
  const { data, error } = await supabase
    .from("barber_services")
    .select(`
      service:services (
        id,
        name,
        duration_minutes,
        price_cents
      )
    `)
    .eq("barber_id", barberId);

  if (error) {
    throw error;
  }

  return data
    .map((relationship) => relationship.service)
    .filter(Boolean)
    .sort((firstService, secondService) =>
      firstService.name.localeCompare(secondService.name)
    );
}
