/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
class RegisteredComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, id, owner } = payload;

    this.content = content;
    this.id = id;
    this.owner = owner;
  }

  _verifyPayload({ content, id, owner }) {
    if (!content || !id || !owner) {
      throw new Error('REGISTERED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof id !== 'string' || typeof owner !== 'string') {
      throw new Error('REGISTERED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RegisteredComment;
