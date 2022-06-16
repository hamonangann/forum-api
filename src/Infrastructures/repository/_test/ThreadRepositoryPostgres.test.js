/* eslint-disable no-undef */
const ThreadTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UserTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist register thread', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' }); // make user that will be owner

      const registerThread = new RegisterThread({
        title: 'some title',
        body: 'some body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread('user-123', registerThread);

      // Assert
      const threads = await ThreadTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });

    it('should return registered thread correctly', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' }); // make user that will be owner

      const registerThread = new RegisterThread({
        title: 'some title',
        body: 'some body',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const registeredThread = await threadRepositoryPostgres.addThread('user-123', registerThread);

      // Assert
      expect(registeredThread).toStrictEqual(new RegisteredThread({
        id: 'thread-123',
        title: 'some title',
        owner: 'user-123',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should throw NotFoundError when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById('thread-xxx'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should return thread detail correctly', async () => {
      // Arrange
      await UserTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
        body: 'body',
        date: '2022-04-11',
      }); // see the default value to check with assertion

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threadDetail = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(threadDetail).toStrictEqual(new ThreadDetail({
        id: 'thread-123',
        title: 'title',
        body: 'body',
        date: '2022-04-11',
        username: 'dicoding',
        comments: [],
      }));
    });
  });
});
