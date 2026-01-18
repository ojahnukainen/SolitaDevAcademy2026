import { prisma } from '../../lib/prisma.js';
import { ElectricityDataJSON } from '../types.js';
import { v4 as uuidv4 } from 'uuid';

async function getPaginatedElectricityData(page: string, pageSize: string) {
  try {
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

    // Fetch detailed data for the unique dates
    const rawData = await getDatesData(uniqueDates, "desc");

    // Process the raw data to calculate daily statistics
    const processedData = calcDayData(rawData);

    // Get total count of unique dates for pagination metadata
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

  } catch (error) {

    return { error: "Error fetching paginated electricity data. Maybe the database is not connected?" };
  }
};

async function getDateData(dateFrom: string) {

  const rawData = await prisma.electricitydata.findMany({
    where: {
      date: {
        equals: new Date(dateFrom)
      }
    }
  });


  const groupedData = rawData.reduce((acc, record) => {

    const dateKey = record.date ? record.date.toISOString().split('T')[0] : 'Unknown Date';

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(record);

    return acc;

  }, {} as Record<string, typeof getDateData>);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return 
  const dateData = JSON.stringify(groupedData, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2);
  const processedData = calcDayData(dateData);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return 
  const prosessedRawData = JSON.stringify(rawData, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2);

  const dayDetailsResult = {
    basicData: processedData,
    hourlyData: JSON.parse(prosessedRawData)
  };

  return (dayDetailsResult);
};

async function getDatesData(uniqueDates: { date: Date }[], order: string) {

  if (!uniqueDates || uniqueDates.length === 0) {
    return JSON.stringify({});
  }
  const dateFrom = uniqueDates[0].date;
  const dateTo = uniqueDates[uniqueDates.length - 1].date;


  const getDateData = await prisma.electricitydata.findMany({
    where: {
      date: {
        lte: new Date(dateFrom), gte: new Date(dateTo)
      }
    },
    orderBy: {
      date: order as 'asc' | 'desc',
    },
  });

  const groupedData = getDateData.reduce((acc, record) => {

    const dateKey = record.date ? record.date.toISOString().split('T')[0] : 'Unknown Date';

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(record);

    return acc;

  }, {} as Record<string, typeof getDateData>);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return 
  const datesData = JSON.stringify(groupedData, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2);

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

};
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
};

// Function to calculate daily statistics
function calcData(date: Date, dayJson: ElectricityDataJSON[]) {
  const MWhToGWh = 1000;
  const kWhToMWh = 1000000;

  const totalProduction = dayJson.map((entry:
    { productionamount: string; }) => parseFloat(entry.productionamount))
    .reduce((acc: number, curr: number) => acc + curr, 0) / MWhToGWh;

  const totalConsumption = dayJson.map((entry:
    { consumptionamount: string; }) => (parseFloat(entry.consumptionamount)))
    .reduce((acc: number, curr: number) => acc + curr, 0) / kWhToMWh;

  const dayPrice = dayJson.map((entry:
    { hourlyprice: string; }) => (parseFloat(entry.hourlyprice)))
    .reduce((acc: number, curr: number) => acc + curr, 0) / dayJson.length;

  let longest: number = 0;
  let check: number = 0;
  for (const item of dayJson) {
    if (parseFloat(item.hourlyprice) < 0) {
      check++;
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
    totalProduction: (totalProduction).toFixed(2),
    totalConsumption: (totalConsumption).toFixed(2),
    longestNegativePriceHours: longest
  };

  return results;
}

function calcDayData(dayData: string) {
  //go through each date in the data and calculate the daily values using the calcData function 
  const dayJson: ElectricityDataJSON[] = JSON.parse(dayData) as ElectricityDataJSON[];
  const results = Object.entries(dayJson).map(([date, records]) => {
    return calcData(date, records);  // Pass the array of records for that date
  });

  return results;
}

export default { getPaginatedElectricityData, getDateData, getDatesData, getUniqueDate, calcDayData };