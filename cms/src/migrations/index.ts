import * as migration_20260924_200342 from './20260924_200342';

export const migrations = [
  {
    up: migration_20260924_200342.up,
    down: migration_20260924_200342.down,
    name: '20260924_200342'
  },
];
