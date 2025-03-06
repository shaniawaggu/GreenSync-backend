// __tests__/userController.test.js

// Mock the Users model to provide required functions for the tests.
jest.mock('../models/User', () => ({
    create: jest.fn(),
    getUserByUserName: jest.fn(),
    getPostcodeById: jest.fn(),
    getUserById: jest.fn(),
  }));
  
  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');
  const Users = require('../models/User');
  
  const { create, login, show, update, destroy } = require('../controllers/userController');
  
  // Set up environment variables used in the controller
  beforeAll(() => {
    process.env.BCRYPT_SALT_ROUNDS = '10';
    process.env.SECRET_TOKEN = 'secret';
  });
  
  // Create mocks for Express response methods
  const mockSend = jest.fn();
  const mockJson = jest.fn();
  const mockEnd = jest.fn();
  const mockStatus = jest.fn(() => ({
    send: mockSend,
    json: mockJson,
    end: mockEnd,
  }));
  const mockRes = { status: mockStatus };
  
  describe('Controller Tests', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    afterAll(() => {
      jest.resetAllMocks();
    });
  
    describe('create', () => {
      it('should create a new user and return status 201', async () => {
        const req = { body: { username: 'test', password: 'password' } };
  
        // Mock bcrypt functions to simulate hashing
        jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
  
        // Mock Users.create to resolve with a new user object
        const newUser = { id: 1, username: 'test', password: 'hashedPassword' };
        Users.create.mockResolvedValue(newUser);
  
        await create(req, mockRes);
  
        expect(bcrypt.genSalt).toHaveBeenCalledWith(parseInt(process.env.BCRYPT_SALT_ROUNDS));
        // Ensure bcrypt.hash is called with the plain password and generated salt
        expect(bcrypt.hash).toHaveBeenCalledWith('password', 'salt');
        expect(Users.create).toHaveBeenCalledWith({
          username: 'test',
          password: 'hashedPassword',
        });
        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith(newUser);
      });
  
      it('should return error with status 400 if creation fails', async () => {
        const req = { body: { username: 'test', password: 'password' } };
        jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
        jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword');
        Users.create.mockRejectedValue(new Error('Creation error'));
  
        await create(req, mockRes);
  
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Creation error' });
      });
    });
  
    describe('login', () => {
      it('should authenticate user and return token with status 200', async () => {
        const req = { body: { username: 'testuser', password: 'password' } };
        const user = { id: 1, passwordHash: 'hashedPassword' };
  
        Users.getUserByUserName.mockResolvedValue(user);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
  
        // Mock jwt.sign to invoke the callback with a fake token
        jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options, callback) => {
          callback(null, 'fakeToken');
        });
  
        await login(req, mockRes);
  
        expect(Users.getUserByUserName).toHaveBeenCalledWith('testuser');
        expect(bcrypt.compare).toHaveBeenCalledWith('password', user.passwordHash);
        expect(jwt.sign).toHaveBeenCalledWith(
          { username: user.id },
          process.env.SECRET_TOKEN,
          { expiresIn: 3600 },
          expect.any(Function)
        );
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({
          success: true,
          token: 'fakeToken',
          user_id: user.id,
        });
      });
  
      it('should return error with status 401 if password does not match', async () => {
        const req = { body: { username: 'testuser', password: 'wrongpassword' } };
        const user = { id: 1, passwordHash: 'hashedPassword' };
  
        Users.getUserByUserName.mockResolvedValue(user);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
  
        await login(req, mockRes);
  
        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({ error: 'User could not be authenticated' });
      });
  
      it('should return error with status 401 if jwt.sign returns error', async () => {
        const req = { body: { username: 'testuser', password: 'password' } };
        const user = { id: 1, passwordHash: 'hashedPassword' };
  
        Users.getUserByUserName.mockResolvedValue(user);
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
  
        // Simulate an error in jwt.sign by calling the callback with an error
        jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options, callback) => {
          callback(new Error('Token error'), null);
        });
  
        await login(req, mockRes);
  
        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Error in token generation' });
      });
  
      it('should return error with status 401 if getUserByUserName fails', async () => {
        const req = { body: { username: 'testuser', password: 'password' } };
        Users.getUserByUserName.mockRejectedValue(new Error('User not found'));
  
        await login(req, mockRes);
  
        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({ error: 'User not found' });
      });
    });
  
    describe('show', () => {
      it('should return user data with status 200', async () => {
        const req = { params: { id: 1 } };
        const user = { id: 1, username: 'testuser' };
  
        Users.getPostcodeById.mockResolvedValue(user);
  
        await show(req, mockRes);
  
        expect(Users.getPostcodeById).toHaveBeenCalledWith(1);
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(user);
      });
  
      it('should return error with status 404 if user is not found', async () => {
        const req = { params: { id: 1 } };
        Users.getPostcodeById.mockRejectedValue(new Error('User not found'));
  
        await show(req, mockRes);
  
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ error: 'User not found' });
      });
    });
  
    describe('update', () => {
      it('should update user and return updated data with status 200', async () => {
        const req = { params: { id: 1 }, body: { username: 'updated' } };
        const user = {
          id: 1,
          update: jest.fn().mockResolvedValue({ id: 1, username: 'updated' }),
        };
  
        Users.getUserById.mockResolvedValue(user);
  
        await update(req, mockRes);
  
        expect(Users.getUserById).toHaveBeenCalledWith(1);
        expect(user.update).toHaveBeenCalledWith({ username: 'updated' });
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({ id: 1, username: 'updated' });
      });
  
      it('should return error with status 404 if update fails', async () => {
        const req = { params: { id: 1 }, body: { username: 'updated' } };
        Users.getUserById.mockRejectedValue(new Error('Update failed'));
  
        await update(req, mockRes);
  
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Update failed' });
      });
    });
  
    describe('destroy', () => {
      it('should delete user and return status 204', async () => {
        const req = { params: { id: 1 } };
        const user = { id: 1, destroy: jest.fn().mockResolvedValue() };
  
        Users.getUserById.mockResolvedValue(user);
  
        await destroy(req, mockRes);
  
        expect(Users.getUserById).toHaveBeenCalledWith(1);
        expect(user.destroy).toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(204);
        expect(mockEnd).toHaveBeenCalled();
      });
  
      it('should return error with status 404 if deletion fails', async () => {
        const req = { params: { id: 1 } };
        Users.getUserById.mockRejectedValue(new Error('Deletion failed'));
  
        await destroy(req, mockRes);
  
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({ error: 'Deletion failed' });
      });
    });
  });
  