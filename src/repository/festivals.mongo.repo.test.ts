import { FestivalModel } from './festivals.mongo.model';
import { FestivalsMongoRepo } from './festivals.mongo.repo.js';

jest.mock('./festivals.mongo.model');

const repo = new FestivalsMongoRepo();
describe('Given UsersMongoRepo', () => {
  describe('When we instantiate the repo', () => {
    test('Then it should be instanced', () => {
      expect(repo).toBeInstanceOf(FestivalsMongoRepo);
    });
  });

  describe('When I use query method', () => {
    test('Then it should return the result of the users', async () => {
      const mockValue = [{ id: '1' }, { id: '2' }];
      (FestivalModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnValue(mockValue),
      }));
      const result = await repo.query();
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
    });
  });

  describe('When I use queryId method', () => {
    test('Then if the findById method resolve value to an object, it should return the object', async () => {
      (FestivalModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnValue({ name: 'test' }),
      }));
      const result = await repo.queryId('1');
      expect(FestivalModel.findById).toHaveBeenCalled();
      expect(result).toEqual({ name: 'test' });
    });

    test('Then if the findById method resolve value to null, it should throw an Error', async () => {
      const mockValue = undefined;
      (FestivalModel.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnValue(mockValue),
      }));
      expect(async () => repo.queryId('1')).rejects.toThrow();
    });
  });

  describe('When I use search method', () => {
    test('Then if it has an mock query object, it should return find resolved value', async () => {
      const mockValue = [{ id: '1' }];
      (FestivalModel.find as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnValue(mockValue),
      }));

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
      (FestivalModel.create as jest.Mock).mockResolvedValue({
        name: 'test',
      });
      const newFestival = {
        name: 'test',
      };
      const result = await repo.create(newFestival);
      expect(result).toEqual(newFestival);
    });
  });

  describe('When I use update method', () => {
    test('Then it should return the updated object', async () => {
      (FestivalModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue({
          id: '1',
          name: 'test',
        }),
      }));

      const result = await repo.update({
        id: '1',
        name: 'test2',
      });
      expect(FestivalModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toEqual({
        id: '1',
        name: 'test',
      });
    });
    test('Then it should throw an error if it has a different id', () => {
      (FestivalModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        undefined
      );
      expect(async () =>
        repo.update({
          id: '1',
          name: 'test',
        })
      ).rejects.toThrow();
    });
    test('Then it should throw an error if it has a different id', () => {
      (FestivalModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(
        undefined
      );
      expect(async () =>
        repo.update({
          id: '1',
          name: 'test',
        })
      ).rejects.toThrowError();
    });
  });
  describe('When I use delete method', () => {
    test('Then it should delete the selected item', async () => {
      const value = '[{ "id": "5", "name": "Test" }]';
      (FestivalModel.findByIdAndDelete as jest.Mock).mockResolvedValue(value);
      await repo.delete('5');
      expect(FestivalModel.findByIdAndDelete).toHaveBeenCalled();
    });
  });

  describe('When call the update destroy without items (error)', () => {
    test('Then it should throw an error', async () => {
      (FestivalModel.findByIdAndDelete as jest.Mock).mockResolvedValue(
        undefined
      );
      const result = repo.delete('1');
      await expect(result).rejects.toThrow();
    });
  });
});
