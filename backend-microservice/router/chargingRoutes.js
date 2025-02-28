const { Router } = require('express');
const chargingRouter = Router();
const chargingController = require('../controllers/chargingController');

//define routes


chargingRouter.get('/', chargingController.index);





module.exports = chargingRouter;
