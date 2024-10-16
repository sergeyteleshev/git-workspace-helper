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

export const FEATURES_MANIFEST: IManifest = [
  [GitCheckoutFeatureService, 'singleton'],
  [GitCommitFeatureService, 'singleton'],
  [GitCreateBranchFeatureService, 'singleton'],
  [GitDiscardChangesFeaturesService, 'singleton'],
  [ConfigureActiveRepositoriesFeatureService, 'singleton'],
  [GitMergeFeatureService, 'singleton'],
  [GitPullFeatureService, 'singleton'],
  [GitPushFeatureService, 'singleton'],
  [GitStageChangesFeatureService, 'singleton'],
  [GitUnstageChangesFeatureService, 'singleton'],
];
