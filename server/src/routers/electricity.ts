import express from 'express';
import electricityServices from '../services/electricityServices.js';

const router = express.Router();

router.get('/', async (req, res) => {

  const page = req.query.page;
  const pageSize = req.query.pageSize;

  if (!page || !pageSize) {
    res.status(400).json('Something is now wrong, missing page or pageSize query parameters.');
  }

  const calcData = await electricityServices.getPaginatedElectricityData(page as string, pageSize as string);
  if (calcData.error !== undefined) {
    console.error(calcData.error);
     return res.status(500).end();
  } 
  console.log('Calculated data:', calcData);
 
  res.send(calcData);
});

// Get data for a specific date
router.get('/:date', async (req, res) => {
  const dataFrom = req.params.date;

  if (!dataFrom) {
     res.status(400).json('Something is now wrong, Missing date parameter.');
  }

  const alldata = await electricityServices.getDateData(dataFrom);

  res.send(alldata);

});

router.get('/uniqueDate', async (req, res) => {
  const dataFrom = req.query.dateFrom;
  console.log('Date from query:', dataFrom);
  const alldata = await electricityServices.getUniqueDate();
  if (alldata.length !== undefined) {
    console.log('Electricity data retrieved successfully.', alldata);
    res.send(alldata);
  }
  else {
    res.status(404).send('No electricity data found.');
  }

});

export default router;