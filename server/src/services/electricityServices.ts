import { prisma } from '../../lib/prisma.js';
import { ElectricityDataJSON } from '../types.js';

async function getAllElectricityData() {   
    
    const getAllElectricityData = await prisma.electricitydata.findFirst();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const allElectricityData = JSON.stringify(getAllElectricityData, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2);

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

function calcDayData(dayData: string) {
    
    console.log("at the calcDayData function");
    console.log('Calculating day data for:', dayData);
    const dayJson: ElectricityDataJSON[] = JSON.parse(dayData) as ElectricityDataJSON[];
    console.log('Parsed day data:', dayJson);
    const totalProduction = dayJson.map((entry: { productionamount: string; }) => parseFloat(entry.productionamount)).reduce((acc: number, curr: number) => acc + curr, 0);


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
        averagePrice: dayPrice,
        totalProduction: totalProduction,
        totalConsumption: totalConsumption,
        longestNegativePriceHours: longest
    };
return results;
}


export default { getAllElectricityData, getDateData, getDatesData, getUniqueDate, calcDayData };