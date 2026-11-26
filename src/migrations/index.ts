import * as migration_20261106_101026_foundation from './20261106_101026_foundation';
import * as migration_20261106_220538_newsroom_workflow from './20261106_220538_newsroom_workflow';
import * as migration_20261106_221546_public_media_eligibility from './20261106_221546_public_media_eligibility';
import * as migration_20261113_112619 from './20261113_112619';
import * as migration_20261126_111253_index_magazine from './20261126_111253_index_magazine';
import * as migration_20261126_231117_writer_applications from './20261126_231117_writer_applications';

export const migrations = [
  {
    up: migration_20261106_101026_foundation.up,
    down: migration_20261106_101026_foundation.down,
    name: '20261106_101026_foundation',
  },
  {
    up: migration_20261106_220538_newsroom_workflow.up,
    down: migration_20261106_220538_newsroom_workflow.down,
    name: '20261106_220538_newsroom_workflow',
  },
  {
    up: migration_20261106_221546_public_media_eligibility.up,
    down: migration_20261106_221546_public_media_eligibility.down,
    name: '20261106_221546_public_media_eligibility',
  },
  {
    up: migration_20261113_112619.up,
    down: migration_20261113_112619.down,
    name: '20261113_112619',
  },
  {
    up: migration_20261126_111253_index_magazine.up,
    down: migration_20261126_111253_index_magazine.down,
    name: '20261126_111253_index_magazine',
  },
  {
    up: migration_20261126_231117_writer_applications.up,
    down: migration_20261126_231117_writer_applications.down,
    name: '20261126_231117_writer_applications'
  },
];
