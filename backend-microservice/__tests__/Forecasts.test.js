// __tests__/Forecast.test.js

jest.mock('../db/connect', () => ({
    query: jest.fn(),
  }));
  
  jest.mock('../optimalwindows', () => ({
    generateWindows: jest.fn(),
  }));
  
  const db = require('../db/connect');
  const Windows = require('../optimalwindows');
  const Forecast = require('../models/Forecasts.js');
  
  describe('Forecast Model', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      // Reset global.fetch for each test.
      global.fetch = jest.fn();
    });
  
    describe('getAll', () => {
      it('should return an array of Forecast instances when rows are found', async () => {
        const fakeRows = [
          { forecast_id: 1, dateandtime: '2025-03-06T00:00:00Z', estimatedenergy: 100, windenergy: 20, solarenergy: 80 },
          { forecast_id: 2, dateandtime: '2025-03-06T01:00:00Z', estimatedenergy: 110, windenergy: 25, solarenergy: 85 },
        ];
        db.query.mockResolvedValueOnce({ rows: fakeRows });
        const forecasts = await Forecast.getAll();
        expect(forecasts).toHaveLength(2);
        expect(forecasts[0]).toBeInstanceOf(Forecast);
        expect(forecasts[0].forecast_id).toBe(1);
        expect(db.query).toHaveBeenCalledWith("SELECT * FROM forecasts;");
      });
  
      it('should throw an error if no forecasts are found', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });
        await expect(Forecast.getAll()).rejects.toThrow("No forecasts found!");
      });
    });
  
    describe('create', () => {
      it('should process fetch calls, perform INSERTs, and return an empty string', async () => {
        // Fake hourly data for location-based fetches.
        const fakeHourlyData = {
          hourly: {
            time: Array.from({ length: 168 }, (_, i) => `2025-03-06T${i}:00:00Z`),
            shortwave_radiation_instant: Array(168).fill(500),
            cloud_cover: Array(168).fill(50),
          },
        };
        // Fake wind speed data.
        const fakeWindData = {
          hourly: {
            wind_speed_120m: Array(168).fill(10),
          },
        };
  
        // Setup fetch mock: first three calls for location data, fourth call for wind speed.
        let fetchCallCount = 0;
        global.fetch.mockImplementation((url) => {
          fetchCallCount++;
          if (fetchCallCount <= 3) {
            return Promise.resolve({
              ok: true,
              json: async () => fakeHourlyData,
            });
          } else {
            return Promise.resolve({
              ok: true,
              json: async () => fakeWindData,
            });
          }
        });
  
        // For the TRUNCATE and INSERT queries.
        // TRUNCATE call:
        db.query.mockImplementation((query, params) => {
          if (query.startsWith('TRUNCATE TABLE forecasts')) {
            return Promise.resolve({ rows: [] });
          }
          // For INSERT queries, return a dummy inserted row.
          if (query.startsWith('INSERT INTO forecasts')) {
            return Promise.resolve({
              rows: [{
                forecast_id: 999,
                dateandtime: params[0],
                estimatedenergy: params[1],
                windenergy: params[2],
                solarenergy: params[3],
              }],
            });
          }
          return Promise.resolve({ rows: [] });
        });
  
        const result = await Forecast.create();
        expect(result).toEqual("");
        // Expect the TRUNCATE query was called.
        expect(db.query).toHaveBeenCalledWith('TRUNCATE TABLE forecasts');
        // Check that the INSERT query was called 168 times.
        const insertCalls = db.query.mock.calls.filter(call => call[0].startsWith('INSERT INTO forecasts'));
        expect(insertCalls.length).toBe(168);
        // Also, the fetch should have been called 4 times.
        expect(global.fetch).toHaveBeenCalledTimes(4);
      });
    });
  
    describe('getWindows', () => {
      it('should return peak totals from Windows.generateWindows when data is found', async () => {
        const fakeForecastRows = [
          { forecast_id: 1, dateandtime: '2025-03-06T00:00:00Z', estimatedenergy: 100, windenergy: 20, solarenergy: 80 },
        ];
        const fakeActivePowerRows = [
          { id: 1, power: 123 },
        ];
        // First query for forecasts.
        db.query.mockResolvedValueOnce({ rows: fakeForecastRows });
        // Second query for active power data.
        db.query.mockResolvedValueOnce({ rows: fakeActivePowerRows });
        // Mock Windows.generateWindows to return a dummy value.
        Windows.generateWindows.mockReturnValue('dummyPeakTotals');
  
        const result = await Forecast.getWindows();
        expect(result).toBe('dummyPeakTotals');
        expect(Windows.generateWindows).toHaveBeenCalledWith(fakeActivePowerRows, fakeForecastRows);
      });
  
      it('should throw an error if no forecasts are found', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });
        await expect(Forecast.getWindows()).rejects.toThrow("No forecasts found!");
      });
  
      it('should throw an error if no activepowerdata is found', async () => {
        const fakeForecastRows = [
          { forecast_id: 1, dateandtime: '2025-03-06T00:00:00Z', estimatedenergy: 100, windenergy: 20, solarenergy: 80 },
        ];
        // First query returns forecasts.
        db.query.mockResolvedValueOnce({ rows: fakeForecastRows });
        // Second query returns empty active power data.
        db.query.mockResolvedValueOnce({ rows: [] });
        await expect(Forecast.getWindows()).rejects.toThrow("No forecasts found!");
      });
    });
  });
  