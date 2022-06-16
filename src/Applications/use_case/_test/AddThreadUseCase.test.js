const RegisteredThread = require('../../../Domains/threads/entities/RegisteredThread');
const RegisterThread = require('../../../Domains/threads/entities/RegisterThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const userId = 'some owner';

    const useCasePayload = {
      title: 'some title',
      body: 'some body',
    };

    const expectedRegisteredThread = new RegisteredThread({
      title: 'some title',
      id: 'some id',
      owner: 'some owner',
    });

    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new RegisteredThread({
        title: 'some title',
        id: 'some id',
        owner: 'some owner',
      })));

    const getThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const registeredThread = await getThreadUseCase.execute(userId, useCasePayload);

    // Assert
    expect(registeredThread).toStrictEqual(expectedRegisteredThread);
    expect(mockThreadRepository.addThread).toBeCalledWith('some owner', new RegisterThread({
      title: 'some title',
      body: 'some body',
    }));
  });
});
