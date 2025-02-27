const Forecast = require('../models/Forecasts');

async function create(req, res) {
    try {
      // console.log("hit the create user controller"
      const newForecast = await Forecast.create();
      res.status(201).json();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async function index(req, res) {
    try {
        const energyForecats = await Forecast.getAll();
        res.status(200).json(energyForecats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

  module.exports = { create, index }