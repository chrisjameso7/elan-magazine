import * as migration_20261023_095728_initial from './20261023_095728_initial';
import * as migration_20261023_190410_media_uploads from './20261023_190410_media_uploads';
import * as migration_20261024_201733_newsletter from './20261024_201733_newsletter';
import * as migration_20261102_173359_culture_brand from './20261102_173359_culture_brand';

export const migrations = [
  {
    up: migration_20261023_095728_initial.up,
    down: migration_20261023_095728_initial.down,
    name: '20261023_095728_initial',
  },
  {
    up: migration_20261023_190410_media_uploads.up,
    down: migration_20261023_190410_media_uploads.down,
    name: '20261023_190410_media_uploads',
  },
  {
    up: migration_20261024_201733_newsletter.up,
    down: migration_20261024_201733_newsletter.down,
    name: '20261024_201733_newsletter',
  },
  {
    up: migration_20261102_173359_culture_brand.up,
    down: migration_20261102_173359_culture_brand.down,
    name: '20261102_173359_culture_brand'
  },
];
