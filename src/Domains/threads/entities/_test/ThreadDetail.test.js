const ThreadDetail = require('../ThreadDetail');

describe('a ThreadDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'yeah',
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'Almanac',
      id: 'still okay',
      body: 'somebody',
      date: 'pls date me',
      username: 'some user',
      comments: 'not array',
    };

    // Action and Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create threadDetail object correctly', () => {
    // Arrange
    const payload = {
      title: 'Almanac',
      id: 'still okay',
      body: 'somebody',
      date: 'pls date me',
      username: 'some user',
      comments: [],
    };

    // Action
    const {
      title,
      id,
      body,
      date,
      username,
      comments,
    } = new ThreadDetail(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(id).toEqual(payload.id);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
    expect(comments).toEqual(payload.comments);
  });
});
