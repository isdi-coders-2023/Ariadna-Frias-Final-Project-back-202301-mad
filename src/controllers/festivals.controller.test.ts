import { Response, Request } from 'express';
import { Festival } from '../entities/festival';
import { PlusRequest } from '../interceptors/logged';
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
    filter: jest.fn(),
  };

  const mockUserRepo = {
    queryId: jest.fn(),
  } as unknown as UsersMongoRepo;

  const resp = {
    json: jest.fn(),
    status: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  const controller = new FestivalsController(mockUserRepo, mockFestivalRepo);

  describe('When the getAll method is called', () => {
    (mockFestivalRepo.query as jest.Mock).mockResolvedValue([
      {
        id: '1',
        name: 'festival1',
      },
      {
        id: '2',
        name: 'festival2',
      },
    ]);
    test('And all the data is OK', async () => {
      const req = {
        query: { mockPage: 1 },
      } as unknown as Request;

      await controller.getAll(req, resp, next);
      expect(mockFestivalRepo.query).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('And if there is an error, next function will be called', async () => {
      const req = {
        body: {},
        params: { id: '' },
        query: { page: 6 },
      } as unknown as Request;
      (mockFestivalRepo.query as jest.Mock).mockRejectedValue(new Error());
      await controller.getAll(req, resp, next);
      expect(mockFestivalRepo.query).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When we use the get method', () => {
    const req = {
      body: {},
      params: { id: '' },
    } as unknown as Request;
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
  describe('When we use the post method', () => {
    test('Then it should create a new festival and return it', async () => {
      const mockUserId = 'mock-user-id';
      const mockFestival = {
        name: 'Mock Festival',
        owner: mockUserId,
      } as unknown as Festival;
      const mockReq = {
        info: { id: mockUserId },
        body: mockFestival,
      } as unknown as PlusRequest;
      const mockResp = { json: jest.fn() } as unknown as Response;
      const mockNext = jest.fn();

      await controller.post(mockReq, mockResp, mockNext);
      expect(mockUserRepo.queryId).toHaveBeenCalledWith(mockUserId);
      expect(mockFestivalRepo.create).toHaveBeenCalledWith(mockFestival);
      expect(mockResp.json).toHaveBeenCalled();
    });

    test('Then if there are errors', async () => {
      const req = {
        body: {},
        params: { id: '' },
      } as unknown as Request;
      (mockFestivalRepo.create as jest.Mock).mockRejectedValue(new Error(''));
      await controller.post(req, resp, next);
      expect(mockFestivalRepo.create).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When we use the patch method', () => {
    const req = {
      body: {
        id: '1',
      },
      params: {
        id: '1',
      },
    } as unknown as Request;
    const resp = { json: jest.fn() } as unknown as Response;
    test('Then if it should be no errors', async () => {
      await controller.patch(req, resp, next);
      expect(mockUserRepo.queryId).toHaveBeenCalledTimes(1);
      expect(mockFestivalRepo.update).toHaveBeenCalledWith(req.body);
      expect(req.params.id).toBe('1');
    });
    test('Then if there are errors', async () => {
      (mockFestivalRepo.update as jest.Mock).mockRejectedValue(new Error(''));
      await controller.patch(req, resp, next);
      expect(mockFestivalRepo.update).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When we use the delete method', () => {
    const req = {
      body: {},
      params: { id: '' },
    } as unknown as Request;
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
  describe('When we use the filter method', () => {
    test('Then if it should be no errors', async () => {
      const req = {
        params: {
          musicTypeFilter: 'rock',
        },
      } as unknown as Request;
      await controller.filterMusic(req, resp, next);
      (mockFestivalRepo.filter as jest.Mock).mockResolvedValue([]);
      expect(mockFestivalRepo.filter).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });

    test('Then if there are errors', async () => {
      const req = {} as unknown as Request;
      (mockFestivalRepo.filter as jest.Mock).mockRejectedValue(new Error(''));
      await controller.filterMusic(req, resp, next);
      expect(next).toHaveBeenCalled();
    });

    test('Then if there are errors', async () => {
      const req = {
        params: {
          musicTypeFilter: '',
        },
      } as unknown as Request;
      (mockFestivalRepo.filter as jest.Mock).mockRejectedValue(new Error(''));
      await controller.filterMusic(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
