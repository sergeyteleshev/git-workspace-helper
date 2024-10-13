import { GitService } from './git/GitService.js';
import { GitRepositoryService } from './git/GitRepositoryService.js';
import { SettingsService } from './settings/SettingsService.js';
import { FeatureManagerService } from './features/FeatureManagerService.js';
import { WorkSpaceCacheService } from './base/WorkspaceCacheService.js';
import { GitCommitFeatureService } from './features/GitCommitFeatureService.js';
import { GitPullFeatureService } from './features/GitPullFeatureService.js';
import { GitDiscardChangesFeaturesService } from './features/GitDiscardChangesFeaturesService.js';
import { GitRepositoriesService } from './git/GitRepositoriesService.js';
import { GitMergeFeatureService } from './features/GitMergeFeatureService.js';
import { ConfigureActiveRepositoriesFeatureService } from './features/ConfigureActiveRepositoriesFeatureService.js';
import { GitStageChangesFeatureService } from './features/GitStageChangesFeatureService.js';
import { GitUnstageChangesFeatureService } from './features/GitUnstageChangesFeatureService.js';
import { GitCheckoutFeatureService } from './features/GitCheckoutFeatureService.js';
import { GitCreateBranchFeatureService } from './features/GitCreateBranchFeatureService.js';
import { SingleServiceImplementation } from '@wroud/di/types';

export const SERVICES_CLASS_REGISTRY: SingleServiceImplementation<any>[] = [
  WorkSpaceCacheService,
  GitService,
  SettingsService,
  GitRepositoryService,
  GitRepositoriesService,
  GitCommitFeatureService,
  GitPullFeatureService,
  GitDiscardChangesFeaturesService,
  FeatureManagerService,
  GitMergeFeatureService,
  ConfigureActiveRepositoriesFeatureService,
  GitStageChangesFeatureService,
  GitUnstageChangesFeatureService,
  GitCheckoutFeatureService,
  GitCreateBranchFeatureService,
];
