import { useLocation, type LocationData } from "@/domain/location/location-store";

export type { LocationData };

export function useCompassLocation() {
	const location = useLocation();
	return { location };
}
