import { useState, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import * as Location from "expo-location";
import { storage } from "../settings/settings-store";

// MMKV Storage Keys
const LATITUDE_KEY = "location.latitude";
const LONGITUDE_KEY = "location.longitude";
const ALTITUDE_KEY = "location.altitude";
const ACCURACY_KEY = "location.accuracy";
const ERROR_KEY = "location.error";
const PERMISSION_STATUS_KEY = "location.permissionStatus";
const CITY_KEY = "location.city";

export interface LocationData {
	latitude: number;
	longitude: number;
	altitude: number | null;
	accuracy: number | null;
	error: string | null;
	permissionStatus: Location.PermissionStatus | null;
	city: string | null;
}

export const getStoredLocation = (): LocationData => {
	return {
		latitude: storage.getNumber(LATITUDE_KEY) ?? 0,
		longitude: storage.getNumber(LONGITUDE_KEY) ?? 0,
		altitude: (storage.contains(ALTITUDE_KEY) ? storage.getNumber(ALTITUDE_KEY) : null) ?? null,
		accuracy: (storage.contains(ACCURACY_KEY) ? storage.getNumber(ACCURACY_KEY) : null) ?? null,
		error: storage.getString(ERROR_KEY) || null,
		permissionStatus: (storage.getString(PERMISSION_STATUS_KEY) as Location.PermissionStatus) || null,
		city: storage.getString(CITY_KEY) || null,
	};
};

type Listener = () => void;
const listeners = new Set<Listener>();

export const subscribeLocation = (listener: Listener) => {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
};

const notify = () => {
	listeners.forEach((l) => l());
};

export const updateLocationData = (data: Partial<LocationData>) => {
	if (data.latitude !== undefined) storage.set(LATITUDE_KEY, data.latitude);
	if (data.longitude !== undefined) storage.set(LONGITUDE_KEY, data.longitude);
	
	if (data.altitude !== undefined) {
		if (data.altitude === null) storage.remove(ALTITUDE_KEY);
		else storage.set(ALTITUDE_KEY, data.altitude);
	}
	
	if (data.accuracy !== undefined) {
		if (data.accuracy === null) storage.remove(ACCURACY_KEY);
		else storage.set(ACCURACY_KEY, data.accuracy);
	}
	
	if (data.error !== undefined) {
		if (data.error === null) storage.remove(ERROR_KEY);
		else storage.set(ERROR_KEY, data.error);
	}
	
	if (data.permissionStatus !== undefined) {
		if (data.permissionStatus === null) storage.remove(PERMISSION_STATUS_KEY);
		else storage.set(PERMISSION_STATUS_KEY, data.permissionStatus);
	}
	
	if (data.city !== undefined) {
		if (data.city === null) storage.remove(CITY_KEY);
		else storage.set(CITY_KEY, data.city);
	}
	
	notify();
};

let trackingSub: Location.LocationSubscription | null = null;
let lastFetchTime = 0;
let isServiceRunning = false;

// Function to fetch reverse geocode
export async function fetchCityName(latitude: number, longitude: number): Promise<string | null> {
	try {
		const [geocode] = await Location.reverseGeocodeAsync({ latitude, longitude });
		if (geocode) {
			return geocode.city || geocode.district || geocode.subregion || geocode.region || null;
		}
	} catch (e) {
		console.warn("Reverse geocode error:", e);
	}
	return null;
}

export async function refreshLocation(force = false) {
	const now = Date.now();
	if (!force && trackingSub && now - lastFetchTime < 30_000) return;
	lastFetchTime = now;

	try {
		const { status } = await Location.getForegroundPermissionsAsync();
		updateLocationData({ permissionStatus: status });

		if (status === Location.PermissionStatus.GRANTED) {
			// Get current position asynchronously
			const initialLoc = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Balanced,
			});
			
			const city = await fetchCityName(initialLoc.coords.latitude, initialLoc.coords.longitude);
			
			updateLocationData({
				latitude: initialLoc.coords.latitude,
				longitude: initialLoc.coords.longitude,
				altitude: initialLoc.coords.altitude,
				accuracy: initialLoc.coords.accuracy,
				error: null,
				permissionStatus: status,
				city,
			});

			if (!trackingSub) {
				trackingSub = await Location.watchPositionAsync(
					{
						accuracy: Location.Accuracy.Balanced,
						timeInterval: 8000,
						distanceInterval: 15,
					},
					async (loc) => {
						const currentStored = getStoredLocation();
						let cityVal = currentStored.city;
						// Re-fetch city name if coordinates shifted significantly or city is currently empty
						if (
							!cityVal || 
							Math.abs(currentStored.latitude - loc.coords.latitude) > 0.005 || 
							Math.abs(currentStored.longitude - loc.coords.longitude) > 0.005
						) {
							cityVal = await fetchCityName(loc.coords.latitude, loc.coords.longitude);
						}
						
						updateLocationData({
							latitude: loc.coords.latitude,
							longitude: loc.coords.longitude,
							altitude: loc.coords.altitude,
							accuracy: loc.coords.accuracy,
							error: null,
							permissionStatus: status,
							city: cityVal,
						});
					}
				);
			}
		} else {
			updateLocationData({
				error: status === Location.PermissionStatus.DENIED ? "Permission denied" : null,
				permissionStatus: status,
			});
			if (trackingSub) {
				trackingSub.remove();
				trackingSub = null;
			}
		}
	} catch (err) {
		console.warn("Error in refreshLocation:", err);
	}
}

export function startLocationService() {
	if (isServiceRunning) return () => {};
	isServiceRunning = true;

	// Initial fetch
	refreshLocation();

	// AppState change listener
	const appStateSub = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
		if (nextAppState === "active") {
			refreshLocation();
		}
	});

	return () => {
		isServiceRunning = false;
		appStateSub.remove();
		if (trackingSub) {
			trackingSub.remove();
			trackingSub = null;
		}
	};
}

export function useLocation() {
	const [location, setLocation] = useState<LocationData>(getStoredLocation);

	useEffect(() => {
		return subscribeLocation(() => {
			setLocation(getStoredLocation());
		});
	}, []);

	return location;
}
