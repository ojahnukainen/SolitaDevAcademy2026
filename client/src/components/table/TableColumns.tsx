import { type ColumnDef } from '@tanstack/react-table'
import type { ElectricityDataJSON } from '@/types'

export const getElectricityColumns = (): ColumnDef<ElectricityDataJSON>[] => [
  {
    accessorKey: "date",
    header: "Date",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "totalProduction",
    header: "Total Production in GW",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "totalConsumption",
    header: "Total Consumption in GW",
    cell: (info) => `${info.getValue() !== null ? info.getValue() : "Data not available"}`,
  },
  {
    accessorKey: "averagePrice",
    header: "Average Price in c/kW",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "longestNegativePriceHours",
    header: "Consecutive below Zero Prices in hours",
    cell: (info) => info.getValue(),
  },
];