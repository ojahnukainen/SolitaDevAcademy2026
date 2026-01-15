import { prisma } from '../../lib/prisma.js';
import { ElectricityDataJSON } from '../types.js';
import {v4 as uuidv4} from 'uuid';

async function getAllElectricityData() {   
    
    const rawData = await prisma.electricitydata.findMany({take: 1000, orderBy: {date: 'desc'}});
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return

    const groupedData = rawData.reduce((acc, record) => {
        // Ensure we have a valid date string to use as a key
        // Since record.date is a Date object, we convert it to a string (YYYY-MM-DD)
        const dateKey = record.date ? record.date.toISOString().split('T')[0] : 'Unknown Date';

        // If the key doesn't exist yet, create it with an empty array
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(record);

            return acc;

    }, {} as Record<string, typeof rawData>);

    const allElectricityData = JSON.stringify(groupedData, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2);
    console.log('Grouped electricity data:', allElectricityData);
    return (allElectricityData);
    
};

async function getDateData(dateFrom: string) {   
    
    const getDateData = await prisma.electricitydata.findMany({where: {
        date: {
            equals: new Date(dateFrom)}
        }});
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const dateData = JSON.stringify(getDateData, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2);

    return (dateData);
    
};

async function getDatesData(dateFrom: string, dateTo: string) {   
    
    const getDateData = await prisma.electricitydata.findMany({
        where: {
            date: {
                gte: new Date(dateFrom), lte: new Date(dateTo)}

            }});
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const datesData = JSON.stringify(getDateData, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2);

    return (datesData);
    
};

async function getUniqueDate() {   
    
    const getUniqueDate = await prisma.electricitydata.findMany({
        distinct: ['date'],
        select: {
            date: true
        },
        orderBy: {
            date: 'desc',
        }, 
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const uniqueDate = JSON.stringify(getUniqueDate, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2);

    return (uniqueDate);
    
}
function calcData(date:string, dayJson: ElectricityDataJSON[]) {
    console.log("at the calcDayData function");
    //console.log('Calculating day data for:', dayData);
    
    const totalProduction = dayJson.map((entry: 
        { productionamount: string; }) => parseFloat(entry.productionamount))
            .reduce((acc: number, curr: number) => acc + curr, 0);


    const totalConsumption = dayJson.map((entry: { consumptionamount: string; }) => (parseFloat(entry.consumptionamount))).reduce((acc: number, curr: number) => acc + curr, 0);
    const dayPrice = dayJson.map((entry: { hourlyprice: string; }) => (parseFloat(entry.hourlyprice))).reduce((acc: number, curr: number) => acc + curr, 0) / dayJson.length;

 
    let longest: number = 0;
    let check: number = 0;
    for(const item of dayJson){
        
        
        console.log('Item in dayJson:', parseFloat(item.hourlyprice));
        
            if(parseFloat(item.hourlyprice) < 0) {
                check++;
                console.log('Current negative price count:', check);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                check > longest ? longest = check : longest;
            }
            
        }
    console.log('Average price calculated:', dayPrice);
    console.log('Total production calculated:', totalProduction);
    console.log('Total consumption calculated:', totalConsumption);
    console.log('Longest consecutive negative price calculated:', longest);
    const results = {
        id: uuidv4(),
        date: date,
        averagePrice: dayPrice.toFixed(2),
        totalProduction: totalProduction.toFixed(2),
        totalConsumption: totalConsumption.toFixed(2),
        longestNegativePriceHours: longest
    };
    
   
return results;
}

function calcDayData(dayData: string) {
   //go through each date in the data and calculate the daily values using the calcData function 
    const dayJson: ElectricityDataJSON[] = JSON.parse(dayData) as ElectricityDataJSON[];
    console.log('Parsed day data:', dayJson);

    const results = Object.entries(dayJson).map(([date, records]) => {
          return calcData(date, records);  // Pass the array of records for that date
      });
      console.log("Calculated day data results:", results);
      return results;
   
}


export default { getAllElectricityData, getDateData, getDatesData, getUniqueDate, calcDayData };