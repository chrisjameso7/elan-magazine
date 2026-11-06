import * as migration_20261106_101026_foundation from './20261106_101026_foundation';

export const migrations = [
  {
    up: migration_20261106_101026_foundation.up,
    down: migration_20261106_101026_foundation.down,
    name: '20261106_101026_foundation'
  },
];
