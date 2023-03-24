import createDebug from 'debug';

import { HTTPError } from '../errors/errors.js';
import { FestivalRepo } from './repo.interface.js';
import { Festival } from '../entities/festival.js';
import { FestivalModel } from './festivals.mongo.model.js';
const debug = createDebug('FINPR:festival-mongo-repo');

export class FestivalsMongoRepo implements FestivalRepo<Festival> {
  public constructor() {
    debug('Festival Mongo Repo instantiate');
  }

  async query(): Promise<Festival[]> {
    const data = await FestivalModel.find().populate('owner', { surname: 0 });
    return data;
  }

  async queryId(id: string): Promise<Festival> {
    debug('queryId: ' + id);
    const data = await FestivalModel.findById(id).populate('owner', {
      surname: 0,
    });

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
    const data = await FestivalModel.find({
      [query.key]: query.value,
    }).populate('owner', { surname: 0 });
    return data;
  }

  async create(info: Partial<Festival>): Promise<Festival> {
    debug('create');
    const data = await FestivalModel.create(info);
    return data;
  }

  async update(info: Partial<Festival>): Promise<Festival> {
    debug('update ' + info.name);
    const data = await FestivalModel.findByIdAndUpdate(info.id, info, {
      new: true,
    }).populate('owner', { surname: 0 });
    if (!data) throw new HTTPError(404, 'Not found!', 'Not found in update!');
    return data;
  }

  async delete(id: string): Promise<void> {
    debug('delete: ' + id);
    const data = await FestivalModel.findByIdAndDelete(id);
    if (!data) throw new HTTPError(404, 'Delete not possible', 'Id not found');
  }

  async filter(musicTypeFilter: string): Promise<Festival[]> {
    debug('filter');
    const data = await FestivalModel.find({
      musicType: musicTypeFilter,
    });
    if (!data) throw new HTTPError(404, 'Not found', 'Theme not found');
    return data;
  }
}
