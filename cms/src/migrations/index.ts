import * as migration_20260924_200342 from './20260924_200342';
import * as migration_20260924_214732 from './20260924_214732';
import * as migration_20260924_221236 from './20260924_221236';
import * as migration_20260924_221827 from './20260924_221827';
import * as migration_20261022_193052_depoimentos_and_apikey from './20261022_193052_depoimentos_and_apikey';

export const migrations = [
  {
    up: migration_20260924_200342.up,
    down: migration_20260924_200342.down,
    name: '20260924_200342',
  },
  {
    up: migration_20260924_214732.up,
    down: migration_20260924_214732.down,
    name: '20260924_214732',
  },
  {
    up: migration_20260924_221236.up,
    down: migration_20260924_221236.down,
    name: '20260924_221236',
  },
  {
    up: migration_20260924_221827.up,
    down: migration_20260924_221827.down,
    name: '20260924_221827',
  },
  {
    up: migration_20261022_193052_depoimentos_and_apikey.up,
    down: migration_20261022_193052_depoimentos_and_apikey.down,
    name: '20261022_193052_depoimentos_and_apikey'
  },
];
