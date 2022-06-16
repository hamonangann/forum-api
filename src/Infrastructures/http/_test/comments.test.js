/* eslint-disable no-undef */
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /comments', () => {
    it('should response 201 and persisted comment', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Arrange
      // add user
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const userJson = JSON.parse(userResponse.payload);
      userId = userJson.data.addedUser.id;

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // make post
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        owner: userId,
        body: 'body',
        date: '2022-04-11',
      });

      // Action - make comment on post
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: {
          content: 'some content',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });

    it('should response 401 when user not logged in', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Arrange
      // add user
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const userJson = JSON.parse(userResponse.payload);
      userId = userJson.data.addedUser.id;

      // make post
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        owner: userId,
        body: 'body',
        date: '2022-04-11',
      });

      // Action - try make comment on post
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: {
          content: 'some content',
        },
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when the thread to be commented does not exist', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Arrange
      // add user
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const userJson = JSON.parse(userResponse.payload);
      userId = userJson.data.addedUser.id;

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action - skip make post, try make comment on post
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-xxx/comments',
        payload: {
          content: 'yeah content',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toEqual(''); // tidak boleh kosong
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Arrange
      // add user
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const userJson = JSON.parse(userResponse.payload);
      userId = userJson.data.addedUser.id;

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // make post
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        owner: userId,
        body: 'body',
        date: '2022-04-11',
      });

      // Action - make comment on post
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: {
          notContent: 'not content',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toEqual(''); // tidak boleh kosong
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Arrange
      // add user
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const userJson = JSON.parse(userResponse.payload);
      userId = userJson.data.addedUser.id;

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // make post
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        owner: userId,
        body: 'body',
        date: '2022-04-11',
      });

      // Action - make comment on post
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: {
          content: [],
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toEqual(''); // tidak boleh kosong
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and soft-delete the comment', async () => {
      // Arrange
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Arrange
      // add user
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const userJson = JSON.parse(userResponse.payload);
      userId = userJson.data.addedUser.id;

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // make post
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        owner: userId,
        body: 'body',
        date: '2022-04-11',
      });

      // make comment
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'content',
        owner: userId,
        date: '2022-04-11',
        is_delete: false,
        comment_to: 'thread-123',
      });

      // action - delete comment
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when user not logged in', async () => {
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Arrange
      // add user
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const userJson = JSON.parse(userResponse.payload);
      userId = userJson.data.addedUser.id;

      // make post
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'title',
        owner: userId,
        body: 'body',
        date: '2022-04-11',
      });

      // make comment
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'content',
        owner: userId,
        date: '2022-04-11',
        is_delete: false,
        comment_to: 'thread-123',
      });

      // Action - try delete comment on post
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        payload: {},
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when the thread to be commented does not exist', async () => {
      // Arrange
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // Arrange
      // add user
      const userResponse = await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      const userJson = JSON.parse(userResponse.payload);
      userId = userJson.data.addedUser.id;

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // action - try delete comment
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-xxx/comments/comment-xxx',
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).not.toEqual(''); // tidak boleh kosong
    });
  });
});
