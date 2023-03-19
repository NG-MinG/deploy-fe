const { Router } = require('express');
const express = require('express');

const checkingController = require('../controllers/checkingController')

const router = express.Router();

router.get('/delivery-check', checkingController.deliveryCheck);

// Order detail
router.get('/:idUser', checkingController.customerGetPackage);

module.exports = router;