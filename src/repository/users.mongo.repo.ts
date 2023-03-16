import createDebug from 'debug';
import { UserModel } from './users.mongo.model.js';
import { User } from '../entities/user.js';

import { HTTPError } from '../errors/errors.js';
import { UserRepo } from './repo.interface.js';
const debug = createDebug('FINPR:user-mongo-repo');

export class UsersMongoRepo implements UserRepo<User> {
  public constructor() {
    debug('User Mongo Repo instantiate');
  }

  async query(): Promise<User[]> {
    const data = await UserModel.find();

    return data as User[];
  }

  async queryId(id: string): Promise<User> {
    debug('queryId: ' + id);
    const data = await UserModel.findById(id).populate('favoriteFestival');
    if (!data)
      throw new HTTPError(
        404,
        'Id not found',
        'Id not found while doing queryId'
      );
    return data;
  }

  async search(query: { key: string; value: unknown }) {
    debug('search method');
    const data = await UserModel.find({ [query.key]: query.value });
    return data;
  }

  async create(info: Partial<User>): Promise<User> {
    debug('create' + info.email);
    const data = await UserModel.create(info);
    return data;
  }

  async update(info: Partial<User>): Promise<User> {
    debug('update ' + info.name);

    const data = await UserModel.findByIdAndUpdate(info.id, info, {
      new: true,
    }).populate('favoriteFestival');
    if (!data)
      throw new HTTPError(404, 'Email not found!', 'Not found in update!');
    return data;
  }
}
