// __tests__/User.test.js

// Mock the database connection so that db.query is a jest.fn()
jest.mock('../db/connect', () => ({
    query: jest.fn(),
  }));
  
  const db = require('../db/connect');
  const Users = require('../models/User.js');
  
  describe('Users Model', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    describe('create', () => {
      it('should throw an error if a user with the same name exists', async () => {
        const userData = { username: 'John', email: 'john@example.com', password: 'pass', postcode: '12345' };
        // Simulate an existing user found in the query.
        db.query.mockResolvedValueOnce({ rows: [{ user_id: 1 }] });
        
        await expect(Users.create(userData)).rejects.toThrow('A user with this name already exists');
        
        expect(db.query).toHaveBeenCalledWith(
          'SELECT * FROM users WHERE LOWER(name) = LOWER($1);',
          ['John']
        );
      });
  
      it('should create a new user if user does not exist', async () => {
        const userData = { username: 'Jane', email: 'jane@example.com', password: 'secret', postcode: '54321' };
        // Simulate no existing user found.
        db.query.mockResolvedValueOnce({ rows: [] });
        // Simulate successful insertion of a new user.
        const insertedRow = { user_id: 2, name: 'Jane', email: 'jane@example.com', password_hash: 'hashed', created_at: '2025-03-06' };
        db.query.mockResolvedValueOnce({ rows: [insertedRow] });
  
        const user = await Users.create(userData);
        expect(user).toBeInstanceOf(Users);
        expect(user.id).toBe(2);
        expect(db.query).toHaveBeenCalledWith(
          'INSERT INTO users (name, email, password_hash, postcode) VALUES ($1, $2, $3, $4) RETURNING *;',
          [userData.username, userData.email, userData.password, userData.postcode]
        );
      });
    });
  
    describe('getPostcodeById', () => {
      it('should return postcode if found', async () => {
        db.query.mockResolvedValueOnce({ rows: [{ postcode: '12345' }] });
        const result = await Users.getPostcodeById(1);
        expect(result).toEqual({ postcode: '12345' });
        expect(db.query).toHaveBeenCalledWith(
          'SELECT postcode FROM users WHERE user_id = $1',
          [1]
        );
      });
  
      it('should throw an error if user is not found', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });
        await expect(Users.getPostcodeById(1)).rejects.toThrow('Unable to find the user!');
      });
    });
  
    describe('getUserByUserName', () => {
      it('should return a Users instance if user is found', async () => {
        const dbRow = { user_id: 3, name: 'Alice', email: 'alice@example.com', password_hash: 'hash', created_at: '2025-03-06' };
        db.query.mockResolvedValueOnce({ rows: [dbRow] });
        const user = await Users.getUserByUserName('Alice');
        expect(user).toBeInstanceOf(Users);
        expect(user.name).toBe('Alice');
        expect(db.query).toHaveBeenCalledWith(
          'SELECT * FROM users WHERE name = $1',
          ['Alice']
        );
      });
  
      it('should throw an error if user is not found', async () => {
        db.query.mockResolvedValueOnce({ rows: [] });
        await expect(Users.getUserByUserName('Bob')).rejects.toThrow('Unable to find the user!');
      });
    });
  
    describe('update', () => {
      it('should update the user and return a new Users instance', async () => {
        const initialData = { user_id: 4, name: 'Bob', email: 'bob@example.com', password_hash: 'oldHash', created_at: '2025-03-06' };
        const user = new Users(initialData);
        const updateData = { name: 'Bobby', email: 'bobby@example.com', passwordHash: 'newHash' };
        const updatedRow = { user_id: 4, name: 'Bobby', email: 'bobby@example.com', password_hash: 'newHash', created_at: '2025-03-06' };
        
        db.query.mockResolvedValueOnce({ rows: [updatedRow] });
        const updatedUser = await user.update(updateData);
        expect(updatedUser).toBeInstanceOf(Users);
        expect(updatedUser.name).toBe('Bobby');
        expect(db.query).toHaveBeenCalledWith(
          'UPDATE users SET name = $1, email = $2, password_hash = $3 WHERE user_id = $4 RETURNING *;',
          [updateData.name, updateData.email, updateData.passwordHash, user.id]
        );
      });
  
      it('should throw an error if update fails', async () => {
        const initialData = { user_id: 5, name: 'Charlie', email: 'charlie@example.com', password_hash: 'hash', created_at: '2025-03-06' };
        const user = new Users(initialData);
        const updateData = { name: 'Charles', email: 'charles@example.com', passwordHash: 'newHash' };
        
        db.query.mockResolvedValueOnce({ rows: [] });
        await expect(user.update(updateData)).rejects.toThrow('User update failed.');
      });
    });
  
    describe('destroy', () => {
      it('should delete the user and return a new Users instance', async () => {
        const initialData = { user_id: 6, name: 'Daisy', email: 'daisy@example.com', password_hash: 'hash', created_at: '2025-03-06' };
        const user = new Users(initialData);
        const deletedRow = { user_id: 6, name: 'Daisy', email: 'daisy@example.com', password_hash: 'hash', created_at: '2025-03-06' };
        
        db.query.mockResolvedValueOnce({ rows: [deletedRow] });
        const result = await user.destroy();
        expect(result).toBeInstanceOf(Users);
        expect(result.id).toBe(6);
        expect(db.query).toHaveBeenCalledWith(
          'DELETE FROM users WHERE user_id = $1 RETURNING *;',
          [user.id]
        );
      });
  
      it('should throw an error if deletion fails', async () => {
        const initialData = { user_id: 7, name: 'Eva', email: 'eva@example.com', password_hash: 'hash', created_at: '2025-03-06' };
        const user = new Users(initialData);
        
        db.query.mockResolvedValueOnce({ rows: [] });
        await expect(user.destroy()).rejects.toThrow('User not found or already deleted');
      });
    });
  });
  