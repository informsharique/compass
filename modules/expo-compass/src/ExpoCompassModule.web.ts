import { registerWebModule, NativeModule } from 'expo';
import { CompassEvents } from './ExpoCompass.types';

class ExpoCompassModule extends NativeModule<CompassEvents> {
  async start(): Promise<void> {
    console.warn('ExpoCompass is not supported on web.');
  }
  async stop(): Promise<void> {
    console.warn('ExpoCompass is not supported on web.');
  }
}

export default registerWebModule(ExpoCompassModule, 'ExpoCompass');
