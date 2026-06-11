import { useState, useEffect } from 'react';
import { CompassState } from '../../domain/compass/types';
import { nativeCompassAdapter } from '../../infrastructure/compass/native-adapter';

export function useCompass() {
  const [state, setState] = useState<CompassState>({
    heading: null,
    calibrated: false,
  });

  useEffect(() => {
    nativeCompassAdapter.startListening((heading) => {
      setState(() => {
        // Calibration: standard headingAccuracy is positive on iOS/Android if calibrated
        // A value of -1 (or < 0) means uncalibrated / poor accuracy
        const calibrated = heading.headingAccuracy >= 0 && heading.headingAccuracy <= 35;
        return {
          heading,
          calibrated,
        };
      });
    });

    return () => {
      nativeCompassAdapter.stopListening();
    };
  }, []);

  return {
    ...state,
  };
}
