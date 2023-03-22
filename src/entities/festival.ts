import { User } from './user';

export type Festival = {
  id: string;
  name: string;
  image: string;
  musicType: string;
  city: string;
  country: string;
  dates: string;
  capacity: number | string;
  owner: User;
};
