const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const userId = 'some owner';
    const threadId = 'some thread';
    const commentId = 'some comment';

    const mockCommentRepository = new CommentRepository();

    mockCommentRepository.verifyCommentOwner = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    mockCommentRepository.deleteCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(true));

    const getCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await getCommentUseCase.execute(userId, threadId, commentId);

    // Assert
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith('some owner', 'some comment');
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith('some thread', 'some comment');
  });
});
