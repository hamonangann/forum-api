const RegisteredComment = require('../../../Domains/comments/entities/RegisteredComment');
const RegisterComment = require('../../../Domains/comments/entities/RegisterComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const userId = 'some owner';
    const threadId = 'some thread';

    const useCasePayload = {
      content: 'some content',
    };

    const expectedRegisteredComment = new RegisteredComment({
      content: 'some content',
      id: 'some id',
      owner: 'some owner',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(new ThreadDetail({
        title: 'Almanac',
        id: 'some thread',
        body: 'somebody',
        date: 'pls date me',
        username: 'some user',
        comments: [],
      })));

    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(new RegisteredComment({
        content: 'some content',
        id: 'some id',
        owner: 'some owner',
      })));

    const getCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const registeredComment = await getCommentUseCase.execute(userId, threadId, useCasePayload);

    // Assert
    expect(registeredComment).toStrictEqual(expectedRegisteredComment);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith('some owner', 'some thread', new RegisterComment({
      content: 'some content',
    }));
  });
});
