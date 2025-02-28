const { Router } = require('express');
const forecastRouter = Router();
const forecastController = require('../controllers/forecastController');

//define routes


//daily update endpoint -> fetch data from api update databse - re calculate values
forecastRouter.post('/update', forecastController.create);

//dashboard show (get) -> weekly data
forecastRouter.get('/', forecastController.index);
// forecastRouter.get('/charging-points', forecastController.)




module.exports = forecastRouter;
