// __tests__/Charging.test.js

jest.mock('../db/connect', () => ({
    query: jest.fn(),
  }));
  
  const db = require('../db/connect');
  const Charging = require('../models/Charging.js');
  
  describe('Charging Model', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('getAll', () => {
      it('should return an array of Charging instances when rows are found', async () => {
        const fakeRows = [
          { ev_location_id: 1, licence_area: 'Area 1', primary_name: 'Charging Station 1', latitude: 50.123, longitude: -0.123 },
          { ev_location_id: 2, licence_area: 'Area 2', primary_name: 'Charging Station 2', latitude: 51.456, longitude: -0.456 },
        ];
        db.query.mockResolvedValueOnce({ rows: fakeRows });
        const result = await Charging.getAll();
        expect(result).toHaveLength(fakeRows.length);
        expect(result[0]).toBeInstanceOf(Charging);
        expect(result[0].ev_location_id).toBe(1);
        expect(result[0].licence_area).toBe('Area 1');
        expect(result[0].primary_name).toBe('Charging Station 1');
        expect(result[0].latitude).toBe(50.123);
        expect(result[0].longitude).toBe(-0.123);
        expect(db.query).toHaveBeenCalledWith("SELECT * FROM evcharginglocations;");
      });
  
      it('should throw an error if no rows are returned', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });
        await expect(Charging.getAll()).rejects.toThrow("No forecasts found!");
      });
    });
  });
  