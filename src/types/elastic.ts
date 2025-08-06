export interface SensorPosition {
  x: number;
  y: number;
  depthInMeter: number;
}

export interface Sensor {
  id: string;
  placement: SensorPosition;
}

export interface SensorDocument {
  sensorId: string;
  status: string;
  readingDate: string;
  sensor: Sensor;
  deltaMovementInMm: number;
}