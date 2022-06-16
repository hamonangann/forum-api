const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');

describe('GetThreadByIdUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    const threadId = 'some thread';

    const expectedThreadDetail = new ThreadDetail({
      title: 'Almanac',
      id: 'still okay',
      body: 'somebody',
      date: 'pls date me',
      username: 'some user',
      comments: [
        {
          id: 'some comment',
          username: 'some user',
          date: '2021-06-04',
          content: 'this is comment',
        },
        {
          id: 'another comment',
          username: 'some user',
          date: '2021-06-03',
          content: '**komentar telah dihapus**',
        },
      ],
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new ThreadDetail({
        title: 'Almanac',
        id: 'still okay',
        body: 'somebody',
        date: 'pls date me',
        username: 'some user',
        comments: [],
      })));

    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'some comment',
          username: 'some user',
          date: '2021-06-04',
          content: 'this is comment',
          is_delete: false,
        },
        {
          id: 'another comment',
          username: 'some user',
          date: '2021-06-03',
          content: 'comment before delete',
          is_delete: true,
        },
      ]));

    const getThreadUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const threadDetail = await getThreadUseCase.execute(threadId);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.getThreadById).toBeCalledWith('some thread');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('some thread');
  });
});
