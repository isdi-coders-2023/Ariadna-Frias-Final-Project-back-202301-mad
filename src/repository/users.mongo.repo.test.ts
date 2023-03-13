import { UserModel } from './users.mongo.model';
import { UsersMongoRepo } from './users.mongo.repo.js';

jest.mock('./users.mongo.model');

const repo = new UsersMongoRepo();
describe('Given UsersMongoRepo', () => {
  describe('When we instantiate the repo', () => {
    test('Then it should be instanced', () => {
      expect(repo).toBeInstanceOf(UsersMongoRepo);
    });
  });

  describe('When I use query method', () => {
    test('Then it should return the result of the users', async () => {
      const mockValue = [{ id: '1' }, { id: '2' }];
      (UserModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnValue(mockValue),
      }));
      const result = await repo.query();
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    });
  });

  describe('When I use queryId method', () => {
    test('Then if the findById method resolve value to an object, it should return the object', async () => {
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnValue({ name: 'test' }),
      }));
      const result = await repo.queryId('1');
      expect(UserModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test' });
    });

    /* Test('Then if the findById method resolve value to null, it should throw an Error', async () => {
      const mockValue = null;
      (UserModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnValue({ name: 'test' }),
      }));
      expect(async () => repo.queryId('')).rejects.toThrow();
    });
  });

  Describe('When I use search method', () => {
    test('Then if it has an mock query object, it should return find resolved value', async () => {
      const mockValue = [{ id: '1' }];
      (UserModel.find as jest.Mock).mockImplementation(() =>
        mockPopulate(mockValue)
      );

      const mockTest = {
        key: 'email',
        value: 'pepe@gmail.com',
      };
      const result = await repo.search(mockTest);
      expect(result).toEqual([{ id: '1' }]);
    });
  });

  describe('When I use create method', () => {
    test('Then it should return an object', async () => {
      (UserModel.create as jest.Mock).mockResolvedValue({
        email: 'test',
      });
      const newUser = {
        email: 'test',
      };
      const result = await repo.create(newUser);
      expect(result).toEqual(newUser);
    });
  });

  describe('When I use update method', () => {
    test('Then it should return the updated object', async () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'test',
      });
      const result = await repo.update({
        id: '1',
        email: 'test2',
      });
      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        email: 'test',
      });
    });
    test('Then it should throw an error if it has a different id', () => {
      (UserModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(undefined);
      expect(async () =>
        repo.update({
          id: '1',
          email: 'test',
        })
      ).rejects.toThrow();
    }); */
  });
});
