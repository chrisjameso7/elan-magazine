import * as migration_20261023_095728_initial from './20261023_095728_initial';
import * as migration_20261023_190410_media_uploads from './20261023_190410_media_uploads';

export const migrations = [
  {
    up: migration_20261023_095728_initial.up,
    down: migration_20261023_095728_initial.down,
    name: '20261023_095728_initial',
  },
  {
    up: migration_20261023_190410_media_uploads.up,
    down: migration_20261023_190410_media_uploads.down,
    name: '20261023_190410_media_uploads'
  },
];
