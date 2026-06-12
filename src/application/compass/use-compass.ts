import { useState, useEffect, useRef } from 'react';
import { Magnetometer, Accelerometer } from 'expo-sensors';
import { CompassState } from '../../domain/compass/types';
import { getCardinalDirection } from '../../domain/compass/heading-utils';

const MAGNETIC_FIELD_MAGNITUDE_LOW = 25;
const MAGNETIC_FIELD_MAGNITUDE_HIGH = 70;

export function useCompass() {
  const [state, setState] = useState<CompassState>({
    heading: null,
    calibrated: false,
  });
  const [magneticField, setMagneticField] = useState<number>(0);

  const lastAngle = useRef<number | null>(null);
  const isFacingDown = useRef<boolean>(false);

  useEffect(() => {
    Magnetometer.setUpdateInterval(100);
    Accelerometer.setUpdateInterval(100);

    const accelSubscription = Accelerometer.addListener((data) => {
      // z is negative when the phone screen is facing down
      isFacingDown.current = data.z < 0;
    });

    const magSubscription = Magnetometer.addListener((data) => {
      const { x, y, z } = data;

      // Invert target X orientation if the screen is facing down to prevent 180 degree shifts
      const targetX = isFacingDown.current ? x : -x;

      // Calculate the raw heading angle
      let rawAngle = Math.atan2(targetX, y) * (180 / Math.PI);
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
        let alpha = 0.1; // Slow filtering for small jitter (< 2 degrees)

        if (absDiff > 10) {
          alpha = 0.95; // Near-instant reaction for large movements (> 10 degrees)
        } else if (absDiff > 2) {
          // Smoothly transition alpha between 0.1 and 0.95
          alpha = 0.1 + (0.85 * (absDiff - 2)) / 8;
        }

        // Apply exponential moving average on the angle
        angle = lastAngle.current + diff * alpha;
        angle = (angle + 360) % 360;
      }

      lastAngle.current = angle;
      
      const fieldStrength = Math.sqrt(x * x + y * y + z * z);
      setMagneticField(fieldStrength);

      const heading = {
        magneticHeading: angle,
        trueHeading: angle, // Cannot determine true north natively from Magnetometer alone
        headingAccuracy: fieldStrength > MAGNETIC_FIELD_MAGNITUDE_LOW && fieldStrength < MAGNETIC_FIELD_MAGNITUDE_HIGH ? 10 : -1, // rough estimate based on Earth's magnetic field (25-65 µT)
        cardinal: getCardinalDirection(angle),
      };

      setState({
        heading,
        calibrated: fieldStrength > MAGNETIC_FIELD_MAGNITUDE_LOW && fieldStrength < MAGNETIC_FIELD_MAGNITUDE_HIGH,
      });
    });

    return () => {
      accelSubscription.remove();
      magSubscription.remove();
    };
  }, []);

  return {
    ...state,
    magneticField,
  };
}
