import express from 'express';
const router = express.Router();

router.get('/', (_req, res) => {
  res.send('Electricity data is coming soon');
  
});

export default router;