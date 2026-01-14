export interface ElectricityDataType {
  id: number;
  date: Date;
  starttime: Date;
  productionamount: number;
  consumptionamount: number;
  hourlyprice: number;
};

export interface ElectricityDataJSON {
    productionamount: string;  // strings from Decimal serialization
    consumptionamount: string;
    hourlyprice: string;
  }