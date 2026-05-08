const express = require('express');
const router = express.Router();
const { triggerScrape } = require('../controllers/scrapeController');

router.post('/', triggerScrape);

module.exports = router;
