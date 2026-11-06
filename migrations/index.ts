import * as migration_20261104_162503_initial from './20261104_162503_initial';
import * as migration_20261106_001659_inner_page_blocks from './20261106_001659_inner_page_blocks';

export const migrations = [
  {
    up: migration_20261104_162503_initial.up,
    down: migration_20261104_162503_initial.down,
    name: '20261104_162503_initial',
  },
  {
    up: migration_20261106_001659_inner_page_blocks.up,
    down: migration_20261106_001659_inner_page_blocks.down,
    name: '20261106_001659_inner_page_blocks'
  },
];
