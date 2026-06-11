import { NativeModule, requireNativeModule } from 'expo';
import { CompassEvents } from './ExpoCompass.types';

declare class ExpoCompassModule extends NativeModule<CompassEvents> {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export default requireNativeModule<ExpoCompassModule>('ExpoCompass');
