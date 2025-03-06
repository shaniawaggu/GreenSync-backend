// __tests__/chargingController.test.js

// Mock the Charging model so its methods can be controlled in tests.
jest.mock('../models/Charging', () => ({
    getAll: jest.fn(),
  }));
  
  const Charging = require('../models/Charging');
  const { index } = require('../controllers/chargingController'); 
  
  // Create mocks for Express response methods.
  const mockSend = jest.fn();
  const mockJson = jest.fn();
  const mockEnd = jest.fn();
  const mockStatus = jest.fn(() => ({
    send: mockSend,
    json: mockJson,
    end: mockEnd,
  }));
  const mockRes = { status: mockStatus };
  
  describe('Charging Controller Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('index', () => {
      it('should return charging points with status 200', async () => {
        // Arrange: Define an array of charging points as the expected response.
        const chargingPoints = [{ id: 1 }, { id: 2 }];
        Charging.getAll.mockResolvedValue(chargingPoints);
        const req = {}; // No request data needed for this controller
  
        // Act: Invoke the index function.
        await index(req, mockRes);
  
        // Assert: Verify that the correct methods were called.
        expect(Charging.getAll).toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(chargingPoints);
      });
  
      it('should return error with status 500 if retrieving charging points fails', async () => {
        // Arrange: Simulate an error during Charging.getAll.
        const errorMessage = 'Error retrieving charging points';
        Charging.getAll.mockRejectedValue(new Error(errorMessage));
        const req = {};
  
        // Act: Invoke the index function.
        await index(req, mockRes);
  
        // Assert: Verify that the error is handled correctly.
        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: errorMessage });
      });
    });
  });
  