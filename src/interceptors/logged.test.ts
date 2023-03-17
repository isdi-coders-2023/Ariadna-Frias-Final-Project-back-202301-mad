import { Response } from 'express';
import { Auth } from '../services/auth';
import { HTTPError } from '../errors/errors';
import { logged, PlusRequest } from './logged';

jest.mock('../services/auth');

describe('Given Logged Interceptor', () => {
  const req = {
    body: {},
    params: { id: '' },
    get: jest.fn(),
  } as unknown as PlusRequest;
  const resp = {
    json: jest.fn(),
  } as unknown as Response;
  const next = jest.fn();

  describe('When the logged interceptor is used', () => {
    test('Then it should send next if there are NOT Authorization header ', () => {
      (req.get as jest.Mock).mockReturnValue(null);
      logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
    test('Then it should send next if Authorization header is in incorrect format', () => {
      (req.get as jest.Mock).mockReturnValue('error token');
      logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(HTTPError));
    });
    test('Then it should send next if Authorization token is not valid', () => {
      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue('Invalid token');
      logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith(expect.any(Error));
    });
    test('Then it should send next if Authorization token is valid', () => {
      (req.get as jest.Mock).mockReturnValue('Bearer token');
      Auth.verifyJWTGettingPayload = jest.fn().mockReturnValue({});
      logged(req, resp, next);
      expect(next).toHaveBeenLastCalledWith();
    });
  });
});
