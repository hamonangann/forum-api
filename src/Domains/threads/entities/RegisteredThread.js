/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
class RegisteredThread {
  constructor(payload) {
    this._verifyPayload(payload);

    const { title, id, owner } = payload;

    this.title = title;
    this.id = id;
    this.owner = owner;
  }

  _verifyPayload({ title, id, owner }) {
    if (!title || !id || !owner) {
      throw new Error('REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof id !== 'string' || typeof owner !== 'string') {
      throw new Error('REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisteredThread;
