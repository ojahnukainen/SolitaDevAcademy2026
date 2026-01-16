import { prisma } from '../../lib/prisma.js';
import { ElectricityDataJSON } from '../types.js';
import {v4 as uuidv4} from 'uuid';

async function getAllElectricityData() {   
    
    const rawData = await prisma.electricitydata.findMany({orderBy: {date: 'desc'}});
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

async function getPaginatedElectricityData(page: string, pageSize: string) {   
    console.log('Fetching paginated electricity data for page:', page, 'with page size:', pageSize);
    const uniqueDates = await prisma.electricitydata.findMany({
        take: Number(pageSize),
        distinct: ['date'],
            select: {
                date: true
            },
            orderBy: {
                date: 'desc',
            },
            skip: (Number(page) - 1) * Number(pageSize),
        
        });

    
    const rawData = await getDatesData(uniqueDates, "desc");
    console.log('Electricity data for selected dates:', rawData);
    const processedData = await calcDayData(rawData);
    const totalUniqueDateCount: number = await getUniqueDateCount();
    
    const paginationData = {
        currentPage: Number(page),
        pageSize: Number(pageSize),
        totalCount: totalUniqueDateCount,
        totalPages: Math.ceil(totalUniqueDateCount / Number(pageSize)),
    };
        
    const result = {
        pagination: paginationData,
        processedData: processedData
    };
    return result;
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

async function getDatesData(uniqueDates: string, order: "asc" | "desc" = "asc") {   
    
    const dateFrom = uniqueDates[0].date;
    const dateTo = uniqueDates[uniqueDates.length -1].date;

    if(order === "desc"){
    const getDateData = await prisma.electricitydata.findMany({
        where: {
            date: {
                lte: new Date(dateFrom), gte: new Date(dateTo)}

            }});
       
    const groupedData = getDateData.reduce((acc, record) => {
        
        const dateKey = record.date ? record.date.toISOString().split('T')[0] : 'Unknown Date';

        // If the key doesn't exist yet, create it with an empty array
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(record);

            return acc;

    }, {} as Record<string, typeof getDateData>);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return 
    const datesData = JSON.stringify(groupedData, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2);

    return (datesData);
    }
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
async function getUniqueDateCount() {   
    
    const getUniqueDateCount = await prisma.electricitydata.findMany({  
        distinct: ['date'],
        select: {
            date: true
        },
        orderBy: {
            date: 'desc',
        }, 
    });
    return getUniqueDateCount.length;
}

function calcData(date: Date, dayJson: ElectricityDataJSON[]) {
    console.log("at the calcDayData function");
   
    
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

async function calcDayData(dayData: string) {
   //go through each date in the data and calculate the daily values using the calcData function 
    const dayJson: ElectricityDataJSON[] = JSON.parse(dayData) as ElectricityDataJSON[];


      const results = await Promise.all(Object.entries(dayJson).map(async ([date, records]) => {
          return calcData(date, records);  // Pass the array of records for that date
      }));
      console.log("Calculated day data results:", results);
      return results;
}


export default { getAllElectricityData, getPaginatedElectricityData, getDateData, getDatesData, getUniqueDate, calcDayData };