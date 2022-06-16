/* eslint-disable no-undef */
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RegisterComment = require('../../../Domains/comments/entities/RegisterComment');
const RegisteredComment = require('../../../Domains/comments/entities/RegisteredComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const CommentTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist register comment', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' }); // make user that will be owner
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
        body: 'body',
        date: '2022-04-11',
      });

      const registerComment = new RegisterComment({
        content: 'some content',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment('user-123', 'thread-123', registerComment);

      // Assert
      const comments = await CommentTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return registered comment correctly', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' }); // make user that will be owner
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
        body: 'body',
        date: '2022-04-11',
      });

      const registerComment = new RegisterComment({
        content: 'some content',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredComment = await commentRepositoryPostgres.addComment('user-123', 'thread-123', registerComment);

      // Assert
      expect(registeredComment).toStrictEqual(new RegisteredComment({
        id: 'comment-123',
        content: 'some content',
        owner: 'user-123',
      }));
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comment detail correctly', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
        body: 'body',
        date: '2022-04-11',
      }); // see the default value to check with assertion
      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
        date: '2022-04-11',
        is_delete: false,
        comment_to: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-123');

      // Assert
      expect(comments).toHaveLength(1);
      expect(comments).toStrictEqual([{
        id: 'comment-123',
        username: 'dicoding',
        content: 'content',
        date: '2022-04-11',
        is_delete: false,
      }]);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw 404 when the comment did not exist', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' }); // make user that will be owner
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
        body: 'body',
        date: '2022-04-11',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-xxx', 'user-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should throw 403 when the comment owner did not match', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' }); // make user that will be owner
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
        body: 'body',
        date: '2022-04-11',
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
        date: '2022-04-11',
        is_delete: false,
        comment_to: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      // Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('user-xxx', 'comment-123'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it('should return true when the comment owner did match', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' }); // make user that will be owner
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
        body: 'body',
        date: '2022-04-11',
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
        date: '2022-04-11',
        is_delete: false,
        comment_to: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = await commentRepositoryPostgres.verifyCommentOwner('user-123', 'comment-123');

      // Assert
      expect(result)
        .toStrictEqual(true);
    });
  });

  describe('deleteCommentById function', () => {
    it('should delete respected comments in the database', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' }); // make user that will be owner
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
        body: 'body',
        date: '2022-04-11',
      });
      await CommentTableTestHelper.addComment({
        id: 'comment-123',
        content: 'content',
        owner: 'user-123',
        date: '2022-04-11',
        is_delete: false,
        comment_to: 'thread-123',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById('thread-123', 'comment-123');

      // Assert
      const comments = await CommentTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
      expect(comments[0].is_delete).toStrictEqual(true);
    });
  });
});
