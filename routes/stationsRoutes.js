const { Router } = require('express');
const catchAsync = require('../utils/catchAsync');
const express = require('express');
const StationModel = require('../models/stationModel')
const router = express.Router();

// List all
router.get('/',  catchAsync(async(req, res, next) => {
  const data = await StationModel.find();
  return res.status(200).json({
    status: 'success',
    data,
  });
}));

module.exports = router;