import { useState, useEffect, useRef } from "react";
import { Magnetometer, Accelerometer } from "expo-sensors";
import { CompassState, Heading } from "@/domain/compass/types";
import { getCardinalDirection } from "@/domain/compass/heading-utils";
import { useSharedValue } from "react-native-reanimated";
import { useIsFocused } from "expo-router";

const MAGNETIC_FIELD_MAGNITUDE_LOW = 25;
const MAGNETIC_FIELD_MAGNITUDE_HIGH = 70;

export function useCompass() {
	const isFocused = useIsFocused();
	const [state, setState] = useState<CompassState & { magneticField: number }>({
		heading: null,
		calibrated: false,
		magneticField: 0,
	});

	const headingSV = useSharedValue(0);

	const lastAngle = useRef<number | null>(null);
	const accelRef = useRef<{ x: number; y: number; z: number } | null>(null);
	const magRef = useRef<{ x: number; y: number; z: number } | null>(null);
	const lastUpdateRef = useRef<number>(0);

	useEffect(() => {
		if (!isFocused) return;

		Magnetometer.setUpdateInterval(16);
		Accelerometer.setUpdateInterval(16);

		const calculateHeading = () => {
			if (!accelRef.current || !magRef.current) return;

			const ax = accelRef.current.x;
			const ay = accelRef.current.y;
			const az = accelRef.current.z;

			const mx = magRef.current.x;
			const my = magRef.current.y;
			const mz = magRef.current.z;

			// Normalise accelerometer vector (gravity vector)
			const a_norm = Math.sqrt(ax * ax + ay * ay + az * az);
			if (a_norm === 0) return;
			const ax_n = ax / a_norm;
			const ay_n = ay / a_norm;
			const az_n = az / a_norm;

			// Calculate East vector E = M x A
			// This is orthogonal to both gravity and the magnetic field
			let ex = my * az_n - mz * ay_n;
			let ey = mz * ax_n - mx * az_n;
			let ez = mx * ay_n - my * ax_n;

			// Normalise East vector
			const e_norm = Math.sqrt(ex * ex + ey * ey + ez * ez);
			if (e_norm === 0) return;
			ex /= e_norm;
			ey /= e_norm;
			ez /= e_norm;

			// Calculate North vector N = A x E
			// Since E is horizontal and A is vertical, N is a horizontal vector pointing magnetic North
			let nx = ay_n * ez - az_n * ey;
			let ny = az_n * ex - ax_n * ez;
			let nz = ax_n * ey - ay_n * ex;

			// Normalise North vector
			const n_norm = Math.sqrt(nx * nx + ny * ny + nz * nz);
			if (n_norm === 0) return;
			nx /= n_norm;
			ny /= n_norm;
			nz /= n_norm;

			// Calculate the heading angle in degrees (0 to 360)
			// The device's forward direction is +Y (top of the phone).
			// The angle in the horizontal plane between North (N) and the device's +Y direction is:
			let rawAngle = Math.atan2(ey, ny) * (180 / Math.PI);
			if (rawAngle < 0) {
				rawAngle += 360;
			}

			let angle = rawAngle;
			if (lastAngle.current !== null) {
				// Find shortest angular difference (-180 to 180 degrees)
				let diff = rawAngle - lastAngle.current;
				while (diff < -180) diff += 360;
				while (diff > 180) diff -= 360;

				const absDiff = Math.abs(diff);
				let alpha = 0.08; // Smooth filter for slow/no rotation movement

				if (absDiff > 15) {
					alpha = 0.8; // Quick response for fast/large rotations
				} else if (absDiff > 2) {
					// Smooth interpolation between 0.08 and 0.8
					alpha = 0.08 + (0.72 * (absDiff - 2)) / 13;
				}

				// Apply low-pass filter
				angle = lastAngle.current + diff * alpha;
				angle = (angle + 360) % 360;
			}

			lastAngle.current = angle;
			headingSV.value = angle;

			const now = Date.now();
			if (now - lastUpdateRef.current > 150) {
				lastUpdateRef.current = now;
				const fieldStrength = Math.sqrt(mx * mx + my * my + mz * mz);

				const heading: Heading = {
					magneticHeading: angle,
					trueHeading: angle, // Cannot determine true north natively from Magnetometer alone
					headingAccuracy:
						fieldStrength > MAGNETIC_FIELD_MAGNITUDE_LOW &&
						fieldStrength < MAGNETIC_FIELD_MAGNITUDE_HIGH
							? 10
							: -1, // rough estimate based on Earth's magnetic field (25-65 µT)
					cardinal: getCardinalDirection(angle),
				};

				const calibrated =
					fieldStrength > MAGNETIC_FIELD_MAGNITUDE_LOW &&
					fieldStrength < MAGNETIC_FIELD_MAGNITUDE_HIGH;

				setState({
					heading,
					calibrated,
					magneticField: fieldStrength,
				});
			}
		};

		const accelSubscription = Accelerometer.addListener((data) => {
			accelRef.current = data;
			calculateHeading();
		});

		const magSubscription = Magnetometer.addListener((data) => {
			magRef.current = data;
			calculateHeading();
		});

		return () => {
			accelSubscription.remove();
			magSubscription.remove();
		};
	}, [isFocused, headingSV]);

	return {
		...state,
		headingSV,
	};
}

