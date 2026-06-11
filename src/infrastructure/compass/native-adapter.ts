import ExpoCompass, { HeadingEvent } from '../../../modules/expo-compass';
import { Heading } from '../../domain/compass/types';
import { getCardinalDirection } from '../../domain/compass/heading-utils';

export type HeadingCallback = (heading: Heading) => void;

class NativeCompassAdapter {
  private listener: any = null;

  startListening(callback: HeadingCallback): void {
    ExpoCompass.start().catch((err) => {
      console.error('Failed to start native compass sensor:', err);
    });

    if (this.listener) {
      this.listener.remove();
    }

    this.listener = ExpoCompass.addListener('onHeadingChange', (event: HeadingEvent) => {
      const headingAngle = event.trueHeading >= 0 ? event.trueHeading : event.magneticHeading;
      const heading: Heading = {
        magneticHeading: event.magneticHeading,
        trueHeading: headingAngle,
        headingAccuracy: event.headingAccuracy,
        cardinal: getCardinalDirection(headingAngle),
      };
      callback(heading);
    });
  }

  stopListening(): void {
    if (this.listener) {
      this.listener.remove();
      this.listener = null;
    }
    ExpoCompass.stop().catch((err) => {
      console.error('Failed to stop native compass sensor:', err);
    });
  }
}

export const nativeCompassAdapter = new NativeCompassAdapter();
