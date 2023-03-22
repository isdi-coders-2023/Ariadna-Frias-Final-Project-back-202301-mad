import { Response } from 'express';
import { FestivalsMongoRepo } from '../repository/festivals.mongo.repo.js';
import { authorized } from './authorized.js';
import { PlusRequest } from '../interfaces/plusrequest.js';
import { HTTPError } from '../errors/errors';

const resp = {} as Response;

const req = {
  info: { id: 'mock-user-id' },
  params: { id: 'mock-festival-id' },
} as unknown as PlusRequest;

const mockRepoFestivals = {} as FestivalsMongoRepo;

describe('Given Authorized Interceptor', () => {
  describe('When the user is authorized', () => {
    test('Then it should call the next function', async () => {
      mockRepoFestivals.queryId = jest.fn().mockResolvedValue({
        owner: { id: 'mock-user-id' },
      });

      const next = jest.fn();
      await authorized(req, resp, next, mockRepoFestivals);
      expect(next).toHaveBeenCalled();
    });
  });
  describe('When the user is not authorized', () => {
    test('Then it should throw an HTTPError', async () => {
      mockRepoFestivals.queryId = jest.fn().mockResolvedValue({
        owner: { id: 'different-user-id' },
      });
      const next = jest.fn();
      await authorized(req, resp, next, mockRepoFestivals);
      expect(next).toHaveBeenCalledWith(expect.any(HTTPError));
    });

    describe('When the token is not found', () => {
      test('Then it should throw an HTTPError', async () => {
        const next = jest.fn();
        delete req.info;
        await authorized(req, resp, next, mockRepoFestivals);
        expect(next).toHaveBeenCalledWith(expect.any(HTTPError));
      });
    });
  });
});
