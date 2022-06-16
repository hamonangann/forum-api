/* eslint-disable no-underscore-dangle */
const RegisterComment = require('../../Domains/comments/entities/RegisterComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    await this._threadRepository.getThreadById(threadId);
    const registerComment = new RegisterComment(useCasePayload);
    return this._commentRepository.addComment(userId, threadId, registerComment);
  }
}

module.exports = AddCommentUseCase;
