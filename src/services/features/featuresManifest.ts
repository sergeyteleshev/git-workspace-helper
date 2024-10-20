import { IManifest } from '../../types/IManifest.js';
import { ConfigureActiveRepositoriesFeatureService } from './ConfigureActiveRepositoriesFeatureService.js';
import { GitCheckoutFeatureService } from './GitCheckoutFeatureService.js';
import { GitCommitFeatureService } from './GitCommitFeatureService.js';
import { GitCreateBranchFeatureService } from './GitCreateBranchFeatureService.js';
import { GitDiscardChangesFeaturesService } from './GitDiscardChangesFeaturesService.js';
import { GitMergeFeatureService } from './GitMergeFeatureService.js';
import { GitPullFeatureService } from './GitPullFeatureService.js';
import { GitPushFeatureService } from './GitPushFeatureService.js';
import { GitStageChangesFeatureService } from './GitStageChangesFeatureService.js';
import { GitUnstageChangesFeatureService } from './GitUnstageChangesFeatureService.js';
import { GitDeleteBranchFeatureService } from './GitDeleteBranchFeatureService.js';
import { GitCreateTagFeatureService } from './GitCreateTagFeatureService.js';
import { GitDeleteTagFeatureService } from './GitDeleteTagFeatureService.js';
import { GitFetchFeatureService } from './GitFetchFeatureService.js';

export const FEATURES_MANIFEST: IManifest = [
  [GitCheckoutFeatureService, 'transient'],
  [GitCommitFeatureService, 'transient'],
  [GitCreateBranchFeatureService, 'transient'],
  [GitDeleteBranchFeatureService, 'transient'],
  [GitDiscardChangesFeaturesService, 'transient'],
  [ConfigureActiveRepositoriesFeatureService, 'transient'],
  [GitMergeFeatureService, 'transient'],
  [GitPullFeatureService, 'transient'],
  [GitPushFeatureService, 'transient'],
  [GitStageChangesFeatureService, 'transient'],
  [GitUnstageChangesFeatureService, 'transient'],
  [GitCreateTagFeatureService, 'transient'],
  [GitDeleteTagFeatureService, 'transient'],
  [GitFetchFeatureService, 'transient'],
];
