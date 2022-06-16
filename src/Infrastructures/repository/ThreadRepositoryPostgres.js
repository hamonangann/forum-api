/* eslint-disable no-underscore-dangle */
const RegisteredThread = require('../../Domains/threads/entities/RegisteredThread');
const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(userId, registerThread) {
    const { title, body } = registerThread;
    const id = `thread-${this._idGenerator()}`;

    const owner = userId;
    const date = new Date().toISOString().slice(0, 10);

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, owner, body, date],
    };

    const result = await this._pool.query(query);

    return new RegisteredThread({
      title: result.rows[0].title,
      id: result.rows[0].id,
      owner: result.rows[0].owner,
    });
  }

  async getThreadById(id) {
    const query = {
      text: 'SELECT threads.*, users.username FROM threads, users WHERE threads.owner = users.id AND threads.id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new ThreadDetail({
      id: result.rows[0].id,
      title: result.rows[0].title,
      body: result.rows[0].body,
      date: result.rows[0].date,
      username: result.rows[0].username,
      comments: [],
    });
  }
}

module.exports = ThreadRepositoryPostgres;
