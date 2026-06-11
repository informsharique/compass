export interface HeadingEvent {
  magneticHeading: number;
  trueHeading: number;
  headingAccuracy: number;
  timestamp: number;
}

export type CompassEvents = {
  onHeadingChange: (event: HeadingEvent) => void;
};
