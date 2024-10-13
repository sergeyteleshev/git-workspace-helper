import { InjectionToken } from 'tsyringe';
import { GitService } from './git/GitService';
import { GitRepositoryService } from './git/GitRepositoryService';
import { SettingsService } from './settings/SettingsService';
import { FeatureManagerService } from './features/FeatureManagerService';
import { WorkSpaceCacheService } from './base/WorkspaceCacheService';
import { GitCommitFeatureService } from './features/GitCommitFeatureService';
import { GitPullFeatureService } from './features/GitPullFeatureService';
import { GitDiscardChangesFeaturesService } from './features/GitDiscardChangesFeaturesService';
import { GitRepositoriesService } from './git/GitRepositoriesService';
import { GitMergeFeatureService } from './features/GitMergeFeatureService';
import { ConfigureActiveRepositoriesFeatureService } from './features/ConfigureActiveRepositoriesFeatureService';
import { GitStageChangesFeatureService } from './features/GitStageChangesFeatureService';
import { GitUnstageChangesFeatureService } from './features/GitUnstageChangesFeatureService';
import { GitCheckoutFeatureService } from './features/GitCheckoutFeatureService';
import { GitCreateBranchFeatureService } from './features/GitCreateBranchFeatureService';

export const SERVICES_CLASS_REGISTRY: InjectionToken<any>[] = [
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
