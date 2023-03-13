import { dbConnect } from './db.connect.js';
import mongoose from 'mongoose';

describe('Given the dbConnect function', () => {
  describe('When it is called in not test environment', () => {
    test('Then it should call the mongoose.connect', async () => {
      const result = await dbConnect('env');
      expect(typeof result).toBe(typeof mongoose);
      expect(mongoose.connection.db.databaseName).not.toContain('Testing');
      mongoose.disconnect();
    });
  });
  describe('When it is called in test environment', () => {
    test('Then it should call the mongoose.connect', async () => {
      const result = await dbConnect();
      expect(typeof result).toBe(typeof mongoose);
      expect(mongoose.connection.db.databaseName).toContain('Testing');
      mongoose.disconnect();
    });
  });
});
