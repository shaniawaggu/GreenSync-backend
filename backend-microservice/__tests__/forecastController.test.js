// __tests__/forecastController.test.js

// Mock the Forecast model so its methods exist and we can control their behavior.
jest.mock('../models/Forecasts', () => ({
    create: jest.fn(),
    getAll: jest.fn(),
    getWindows: jest.fn(),
  }));
  
  const Forecast = require('../models/Forecasts');
  const { create, index, windows } = require('../controllers/forecastController');
  
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
  
  describe('Forecast Controller Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('create', () => {
      it('should create a new forecast and return status 201', async () => {
        // Arrange: Simulate Forecast.create resolving successfully.
        const newForecast = { id: 1, data: 'forecast data' };
        Forecast.create.mockResolvedValue(newForecast);
        // req is not used in this controller.
        const req = {};
  
        // Act:
        await create(req, mockRes);
  
        // Assert:
        expect(Forecast.create).toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(201);
        // The controller calls json() without any payload on success.
        expect(mockJson).toHaveBeenCalledWith();
      });
  
      it('should return error with status 400 if forecast creation fails', async () => {
        // Arrange:
        const errorMessage = 'Creation failed';
        Forecast.create.mockRejectedValue(new Error(errorMessage));
        const req = {};
  
        // Act:
        await create(req, mockRes);
  
        // Assert:
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ error: errorMessage });
      });
    });
  
    describe('index', () => {
      it('should return all forecasts with status 200', async () => {
        // Arrange:
        const forecasts = [{ id: 1 }, { id: 2 }];
        Forecast.getAll.mockResolvedValue(forecasts);
        const req = {};
  
        // Act:
        await index(req, mockRes);
  
        // Assert:
        expect(Forecast.getAll).toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(forecasts);
      });
  
      it('should return error with status 500 if getting forecasts fails', async () => {
        // Arrange:
        const errorMessage = 'GetAll failed';
        Forecast.getAll.mockRejectedValue(new Error(errorMessage));
        const req = {};
  
        // Act:
        await index(req, mockRes);
  
        // Assert:
        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: errorMessage });
      });
    });
  
    describe('windows', () => {
      it('should return forecast windows with status 200', async () => {
        // Arrange:
        const windowsData = [{ window: 1 }, { window: 2 }];
        Forecast.getWindows.mockResolvedValue(windowsData);
        const req = {};
  
        // Act:
        await windows(req, mockRes);
  
        // Assert:
        expect(Forecast.getWindows).toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(windowsData);
      });
  
      it('should return error with status 500 if getting windows fails', async () => {
        // Arrange:
        const errorMessage = 'GetWindows failed';
        Forecast.getWindows.mockRejectedValue(new Error(errorMessage));
        const req = {};
  
        // Act:
        await windows(req, mockRes);
  
        // Assert:
        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({ error: errorMessage });
      });
    });
  });
  