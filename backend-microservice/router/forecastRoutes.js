const { Router } = require('express');
const forecastRouter = Router();
const forecastController = require('../controllers/forecstController');

//define routes


//daily update endpoint -> fetch data from api update databse - re calculate values
forecastRouter.post('/update', forecastController.create);

//dashboard show (get) -> weekly data
forecastRouter.get('/', authenticator, forecastRouter.index)





module.exports = forecastRouter;
