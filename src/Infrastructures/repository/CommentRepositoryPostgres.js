/* eslint-disable no-underscore-dangle */
const RegisteredComment = require('../../Domains/comments/entities/RegisteredComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(userId, threadId, registerComment) {
    const { content } = registerComment;
    const id = `comment-${this._idGenerator()}`;

    const owner = userId;
    const date = new Date().toISOString().slice(0, 10);

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, owner, date, false, threadId],
    };

    const result = await this._pool.query(query);

    return new RegisteredComment({
      content: result.rows[0].content,
      id: result.rows[0].id,
      owner: result.rows[0].owner,
    });
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT comments.id, users.username, date, content, is_delete FROM comments, users WHERE users.id = comments.owner AND comment_to = $1 ORDER BY date desc',
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async verifyCommentOwner(userId, commentId) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) { // 404
      throw new NotFoundError('comment tidak ditemukan');
    }

    if (result.rows[0].owner !== userId) { // 403
      throw new AuthorizationError('anda tidak dapat menghapus comment ini');
    }

    return true;
  }

  async deleteCommentById(threadId, commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1 AND comment_to = $2',
      values: [commentId, threadId],
    };

    await this._pool.query(query);

    return true;
  }
}

module.exports = CommentRepositoryPostgres;
