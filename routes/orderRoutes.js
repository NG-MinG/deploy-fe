const { Router } = require('express');
const express = require('express');

const orderController = require('../controllers/orderController')

const router = express.Router();

// List all
router.get('/', orderController.getAll);

// Order detail
router.get('/:id', orderController.getOne);

module.exports = router;