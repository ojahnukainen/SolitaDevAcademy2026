export interface ElectricityData {
  id: number;
  timestamp: Date;
  consumption: bigint;
  production: bigint;
};