import express from 'express';
import electricityServices from '../services/electricityServices.js';

const router = express.Router();

router.get('/', async (req, res) => {

  const page = req.query.page;
  const pageSize = req.query.pageSize;

  if (!page || !pageSize) {
    res.status(400).json('Missing page or pageSize query parameters.');
  }

  const calcData = await electricityServices.getPaginatedElectricityData(page as string, pageSize as string);

  res.send(calcData);
});

// Get data for a specific date
router.get('/:date', async (req, res) => {
  const dataFrom = req.params.date;

  if (!dataFrom) {
    return res.status(400).json('Missing date parameter.');
  }

  console.log('Date from query:', dataFrom);
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