/* eslint-disable no-underscore-dangle */
class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, commentId) {
    await this._commentRepository.verifyCommentOwner(userId, commentId);
    return this._commentRepository.deleteCommentById(threadId, commentId);
  }
}

module.exports = DeleteCommentUseCase;
