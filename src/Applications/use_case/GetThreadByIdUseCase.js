/* eslint-disable no-underscore-dangle */
class GetThreadByIdUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    const fetchThreadComments = await this._commentRepository.getCommentsByThreadId(threadId);
    for (let i = 0; i < fetchThreadComments.length; i += 1) {
      thread.comments.push({
        id: fetchThreadComments[i].id,
        content: fetchThreadComments[i].content,
        date: fetchThreadComments[i].date,
        username: fetchThreadComments[i].username,
      });
      if (fetchThreadComments[i].is_delete) {
        thread.comments[i].content = '**komentar telah dihapus**';
      }
    }

    return thread;
  }
}

module.exports = GetThreadByIdUseCase;
