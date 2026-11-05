import * as migration_20261104_162503_initial from './20261104_162503_initial';

export const migrations = [
  {
    up: migration_20261104_162503_initial.up,
    down: migration_20261104_162503_initial.down,
    name: '20261104_162503_initial'
  },
];
