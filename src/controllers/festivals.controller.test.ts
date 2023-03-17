import { Response, Request } from 'express';
import { FestivalsMongoRepo } from '../repository/festivals.mongo.repo';

import { UsersMongoRepo } from '../repository/users.mongo.repo';
import { FestivalsController } from './festivals.controller';

describe('Given the FestivalsController', () => {
  const mockFestivalRepo: FestivalsMongoRepo = {
    create: jest.fn(),
    query: jest.fn(),
    search: jest.fn(),
    queryId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepo = {
    queryId: jest.fn(),
  } as unknown as UsersMongoRepo;

  const req = {
    body: {},
    params: { id: '' },
  } as unknown as Request;
  const resp = {
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  const controller = new FestivalsController(mockUserRepo, mockFestivalRepo);

  describe('When the getAll method is called', () => {
    test('And all the data is OK', async () => {
      const req = {} as unknown as Request;
      await controller.getAll(req, resp, next);
      expect(mockFestivalRepo.query).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('And if there is an error, next function will be called', async () => {
      (mockFestivalRepo.query as jest.Mock).mockRejectedValue(new Error());
      await controller.getAll(req, resp, next);
      expect(mockFestivalRepo.query).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When we use get', () => {
    test('Then if it should be no errors', async () => {
      await controller.get(req, resp, next);
      expect(mockFestivalRepo.queryId).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there are errors', async () => {
      (mockFestivalRepo.queryId as jest.Mock).mockRejectedValue(new Error(''));
      await controller.get(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When we use post', () => {
    const mockFestival = {
      name: 'test',
      city: 'Barcelona',
      owner: { id: '1' },
    };

    test('Then if it should be no errors', async () => {
      (mockFestivalRepo.create as jest.Mock).mockResolvedValue({
        mockFestival,
      });
      await controller.post(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });
    test('Then if it should be no errors', async () => {
      (mockUserRepo.queryId as jest.Mock).mockResolvedValue({});

      await controller.post(req, resp, next);
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there are errors', async () => {
      (mockFestivalRepo.create as jest.Mock).mockRejectedValue(new Error(''));
      await controller.post(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When we use patch', () => {
    test('Then if it should be no errors', async () => {
      await controller.patch(req, resp, next);
      expect(mockFestivalRepo.update).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there are errors', async () => {
      (mockFestivalRepo.update as jest.Mock).mockRejectedValue(new Error(''));
      await controller.patch(req, resp, next);
      expect(mockFestivalRepo.update).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When we use delete', () => {
    test('Then if it should be no errors', async () => {
      await controller.delete(req, resp, next);
      expect(mockFestivalRepo.delete).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there are errors', async () => {
      (mockFestivalRepo.delete as jest.Mock).mockRejectedValue(new Error(''));
      await controller.delete(req, resp, next);
      expect(mockFestivalRepo.delete).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});
