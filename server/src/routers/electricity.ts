import express from 'express';
import electricityServices from '../services/electricityServices.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  
  const alldata = await electricityServices.getAllElectricityData();
  if(alldata.length !== undefined){
    console.log('Electricity data retrieved successfully.', alldata);
    res.send(alldata);} 
  else {
      res.status(404).send('No electricity data found.');
    }
  
});

// Get data for a specific date
router.get('/date', async (req, res) => {
  const dataFrom = req.query.dateFrom;
  //const dataTo = req.query.dateTo;
  console.log('Date from query:', dataFrom);
  const alldata = await electricityServices.getDateData(dataFrom as string);
  
  if(alldata.length !== undefined){
    const calcData =  electricityServices.calcDayData(alldata);
    res.send(calcData);} 
  else {
      res.status(404).send('No electricity data found.');
    }
});

router.get('/uniqueDate', async (req, res) => {
  const dataFrom = req.query.dateFrom;
  //const dataTo = req.query.dateTo;
  console.log('Date from query:', dataFrom);
  const alldata = await electricityServices.getUniqueDate();
  if(alldata.length !== undefined){
    console.log('Electricity data retrieved successfully.', alldata);
    res.send(alldata);} 
  else {
      res.status(404).send('No electricity data found.');
    }
  
});

export default router;