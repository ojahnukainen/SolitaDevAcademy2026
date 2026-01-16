import express from 'express';
import electricityServices from '../services/electricityServices.js';

const router = express.Router();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/', async (req, res) => {
  
  const page = req.query.page;
  const pageSize = req.query.pageSize;
  
  const calcData = await electricityServices.getPaginatedElectricityData(page as string, pageSize as string);
  
  console.log('Raw electricity data:', calcData.pagination);
  res.send(calcData);
 
  
});

// Get data for a specific date
router.get('/:date', async (req, res) => {
  const dataFrom = req.params.date;
  
  console.log('Date from query:', dataFrom);
  const alldata = await electricityServices.getDateData(dataFrom as string);
 
    res.send(alldata); 
  
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