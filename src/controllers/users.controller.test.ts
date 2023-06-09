import { UsersController } from './users.controller';
import { Request, Response } from 'express';
import { Auth } from '../services/auth';
import { FestivalsMongoRepo } from '../repository/festivals.mongo.repo';

jest.mock('../services/auth');
describe('Given the UsersController', () => {
  const mockRepoUsers = {
    query: jest.fn(),
    queryId: jest.fn(),
    search: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  const mockFestivalRepo = {} as FestivalsMongoRepo;
  const controller = new UsersController(mockRepoUsers, mockFestivalRepo);
  const resp = {
    status: jest.fn(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();

  describe('When the getAll method is called', () => {
    test('And all the data is OK', async () => {
      const req = {} as unknown as Request;
      await controller.getAll(req, resp, next);
      expect(mockRepoUsers.query).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('And if there is an error, next function will be called', async () => {
      const req = {} as unknown as Request;
      mockRepoUsers.query.mockRejectedValue('error');
      await controller.getAll(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the register method is called', () => {
    test('And all the data is correctly introduced, there should be a status and a json response', async () => {
      const req = {
        body: {
          email: 'test1',
          password: 'pass',
        },
      } as unknown as Request;
      await controller.register(req, resp, next);
      expect(mockRepoUsers.create).toHaveBeenCalled();
      expect(resp.status).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('And the email is missing, next function will be called', async () => {
      const req = {
        body: {
          password: 'pa',
        },
      } as unknown as Request;
      mockRepoUsers.create.mockRejectedValue('error');
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('And the password is missing, next function will be called', async () => {
      const req = {
        body: {
          email: 'test3',
        },
      } as unknown as Request;
      mockRepoUsers.create.mockRejectedValue('error');
      await controller.register(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When the login method is called', () => {
    test('And all the data is correctly introduced, there should be a status and a json response', async () => {
      const req = {
        body: {
          email: 'test4',
          password: 'p',
        },
      } as unknown as Request;

      mockRepoUsers.search.mockResolvedValue([1]);
      Auth.compare = jest.fn().mockResolvedValue(true);
      await controller.login(req, resp, next);
      expect(mockRepoUsers.search).toHaveBeenCalled();
      expect(resp.json).toHaveBeenCalled();
    });
    test('There it should be an HTTPError if there is no data', async () => {
      const req = {
        body: {
          email: 'test1',
          password: 'pass',
        },
      } as unknown as Request;
      mockRepoUsers.search.mockResolvedValue([]);
      await controller.login(req, resp, next);
      expect(mockRepoUsers.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
    test('Then it should throw an HTTPError if the password is wrong', async () => {
      const req = {
        body: {
          email: 'pep',
          password: 'pass',
        },
      } as unknown as Request;
      Auth.compare = jest.fn().mockResolvedValue(false);
      mockRepoUsers.search.mockResolvedValue(['test']);
      await controller.login(req, resp, next);
      expect(mockRepoUsers.search).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    test('And the email is missing, next function will be called', async () => {
      const req = {
        body: {
          passwd: 'a',
        },
      } as unknown as Request;
      mockRepoUsers.search.mockRejectedValue('error');
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
    test('And the password is missing, next function will be called', async () => {
      const req = {
        body: {
          email: 'test',
        },
      } as unknown as Request;
      mockRepoUsers.search.mockRejectedValue('error');
      await controller.login(req, resp, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
