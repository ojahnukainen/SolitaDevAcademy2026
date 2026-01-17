export type ElectricityDataJSON = {
    id: number;
    date: string;
    totalProduction: string;
    totalConsumption: string;
    averagePrice: string;
    longestNegativePriceHours: string;
}

export type DetailedDayData = {
    basicData: {
        date: string;
        totalProduction: string;
        totalConsumption: string;
        averagePrice: string;
        longestNegativePriceHours: string;
    }[] | null;
    hourlyData: {
        starttime: string;
        hourlyprice: number;
    }[];
}