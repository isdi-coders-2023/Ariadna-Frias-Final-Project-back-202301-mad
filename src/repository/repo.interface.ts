import { Festival } from '../entities/festival';

export interface FestivalRepo<T> {
  query(): Promise<Festival[]>;
  queryId(_id: string): Promise<Festival>;
  search(query: { key: string; value: unknown }): Promise<Festival[]>;
  create(_info: Partial<Festival>): Promise<Festival>;
  update(_info: Partial<Festival>): Promise<Festival>;
  delete(_id: string): Promise<void>;
  filter(musicType: string): Promise<Festival[]>;
}

export interface UserRepo<User> {
  query(): Promise<User[]>;
  queryId(_id: string): Promise<User>;
  search(query: { key: string; value: unknown }): Promise<User[]>;
  create(_info: Partial<User>): Promise<User>;
  update(_info: Partial<User>): Promise<User>;
}
