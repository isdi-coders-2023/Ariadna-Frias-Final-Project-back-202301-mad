import { Festival } from './festival';

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  favoriteFestival: Festival[];
};
