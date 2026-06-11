import { useState, useEffect } from 'react';
import { Magnetometer } from 'expo-sensors';
import { CompassState } from '../../domain/compass/types';
import { getCardinalDirection } from '../../domain/compass/heading-utils';

export function useCompass() {
  const [state, setState] = useState<CompassState>({
    heading: null,
    calibrated: false,
  });
  const [magneticField, setMagneticField] = useState<number>(0);

  useEffect(() => {
    Magnetometer.setUpdateInterval(100);
    const subscription = Magnetometer.addListener((data) => {
      const { x, y, z } = data;
      // Calculate basic 2D heading (uncompensated for tilt)
      // Usually Y is pointing North, X is East.
      // angle = atan2(X, Y) relative to North
      let angle = Math.atan2(x, y) * (180 / Math.PI);
      if (angle < 0) {
        angle += 360;
      }
      
      const fieldStrength = Math.sqrt(x * x + y * y + z * z);
      setMagneticField(fieldStrength);

      const heading = {
        magneticHeading: angle,
        trueHeading: angle, // Cannot determine true north natively from Magnetometer alone
        headingAccuracy: fieldStrength > 20 && fieldStrength < 65 ? 10 : -1, // rough estimate based on Earth's magnetic field (25-65 µT)
        cardinal: getCardinalDirection(angle),
      };

      setState({
        heading,
        calibrated: fieldStrength > 20 && fieldStrength < 65,
      });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    ...state,
    magneticField,
  };
}
