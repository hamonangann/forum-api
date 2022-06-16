const RegisteredThread = require('../RegisteredThread');

describe('a RegisteredThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'yeah',
      id: 'right',
    };

    // Action and Assert
    expect(() => new RegisteredThread(payload)).toThrowError('REGISTERED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'Almanac',
      id: true,
      owner: 'some-user',
    };

    // Action and Assert
    expect(() => new RegisteredThread(payload)).toThrowError('REGISTERED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create registeredThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'some title',
      id: 'some id',
      owner: 'some owner',
    };

    // Action
    const { title, id, owner } = new RegisteredThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(id).toEqual(payload.id);
    expect(owner).toEqual(payload.owner);
  });
});
