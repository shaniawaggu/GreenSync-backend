const { Router } = require('express');
const forcastRouter = Router();
const forcastController = require('../controllers/forcstingController');

//define routes


//daily update endpoint -> fetch data from api update databse - re calculate values
forcastRouter.post('/update', forcastController.create);

//dashboard show (get)
//send pre calculated data back to the front end




module.exports = forcastRouter;
