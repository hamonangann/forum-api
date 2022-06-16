/* eslint-disable no-underscore-dangle */
const RegisterThread = require('../../Domains/threads/entities/RegisterThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const registerThread = new RegisterThread(useCasePayload);
    return this._threadRepository.addThread(userId, registerThread);
  }
}

module.exports = AddThreadUseCase;
