import { useState, useEffect } from "react";
import * as Location from "expo-location";

export interface LocationData {
	latitude: number;
	longitude: number;
	altitude: number | null;
	accuracy: number | null;
	city: string | null;
	error: string | null;
}

export function useCompassLocation() {
	const [location, setLocation] = useState<LocationData | null>(null);

	useEffect(() => {
		let subscription: Location.LocationSubscription | null = null;

		async function startTracking() {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				setLocation({
					latitude: 0,
					longitude: 0,
					altitude: null,
					accuracy: null,
					city: null,
					error: "Permission denied",
				});
				return;
			}

			try {
				const initialLoc = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Balanced,
				});
				updateLocationState(initialLoc);
			} catch (err) {
				console.warn("Error fetching initial location:", err);
			}

			subscription = await Location.watchPositionAsync(
				{
					accuracy: Location.Accuracy.Balanced,
					timeInterval: 8000,
					distanceInterval: 15,
				},
				(loc) => {
					updateLocationState(loc);
				}
			);
		}

		async function updateLocationState(loc: Location.LocationObject) {
			let city: string | null = null;
			try {
				const [geocode] = await Location.reverseGeocodeAsync({
					latitude: loc.coords.latitude,
					longitude: loc.coords.longitude,
				});
				if (geocode) {
					city =
						geocode.city ||
						geocode.district ||
						geocode.subregion ||
						geocode.region ||
						null;
				}
			} catch {
				// Safe to ignore geocoding errors
			}

			setLocation({
				latitude: loc.coords.latitude,
				longitude: loc.coords.longitude,
				altitude: loc.coords.altitude,
				accuracy: loc.coords.accuracy,
				city,
				error: null,
			});
		}

		startTracking();

		return () => {
			if (subscription) {
				subscription.remove();
			}
		};
	}, []);

	return location;
}
