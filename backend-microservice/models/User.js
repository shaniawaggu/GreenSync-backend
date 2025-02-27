const db = require('../db/connect');

class Users {
  constructor({ user_id, name, email, password_hash, created_at }) {
    this.id = user_id;
    this.name = name;
    this.email = email;
    this.passwordHash = password_hash;
    this.created_at = created_at;
  }

  // Create new User
  static async create(data) {
    const { username, email, password, postcode } = data;
    const existingUser = await db.query(
      'SELECT * FROM users WHERE LOWER(name) = LOWER($1);',
      [username]
    );
    if (existingUser.rows.length === 1) {
      throw Error('A user with this email already exists');
    } else {
      let response = await db.query(
        'INSERT INTO users (name, email, password_hash, postcode) VALUES ($1, $2, $3, $4) RETURNING *;',
        [username, email, password, postcode]
      );
      return new Users(response.rows[0]);
    }
  }

  // Get one user by Id
  static async getUserById(id) {
    const response = await db.query('SELECT * FROM users WHERE user_id = $1', [
      id,
    ]);
    if (response.rows.length !== 1) {
      throw Error('Unable to find the user!');
    } else {
      return new Users(response.rows[0]);
    }
  }

  static async getUserByUserName(username) {
    const response = await db.query('SELECT * FROM users WHERE name = $1', [
      username,
    ]);
    if (response.rows.length !== 1) {
      throw Error('Unable to find the user!');
    } else {
      return new Users(response.rows[0]);
    }
  }

  //update existing user
  async update(data) {
    const { name, email, passwordHash } = data;
    const response = await db.query(
      'UPDATE users SET name = $1, email = $2, password_hash = $3 WHERE user_id = $4 RETURNING *;',
      [name, email, passwordHash, this.id]
    );
    if (response.rows.length !== 1) {
      throw Error('User update failed.');
    } else {
      return new Users(response.rows[0]);
    }
  }

  // Delete an existing user by passing his/her id
  async destroy() {
    const response = await db.query(
      'DELETE FROM users WHERE user_id = $1 RETURNING *;',
      [this.id]
    );
    if (response.rows.length === 0) {
      throw new Error('User not found or already deleted');
    } else {
      return new Users(response.rows[0]);
    }
  }
}

module.exports = Users;
