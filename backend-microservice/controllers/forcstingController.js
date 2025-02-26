const Forecast = require('../models/Forcasts');

async function create(req, res) {
    try {
      // console.log("hit the create user controller"
      const newForecast = await Forecast.create();
      res.status(201).json();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  module.exports = { create }