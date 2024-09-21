import { InjectionToken } from 'tsyringe';
import { GitService } from './git/GitService';
import { GitRepositoryService } from './git/GitRepositoryService';
import { GitRepositoryTravelService } from './git/GitRepositoryTravelService';
import { SettingsService } from './settings/SettingsService';
import { FeatureManagerService } from './features/FeatureManagerService';
import { GitRepositoriesActionsService } from './git/GitRepositoriesActionsService';
import { GitRepositoriesBranchService } from './git/GitRepositoriesBranchService';
import { VscodeContextService } from './VscodeContextService';
import { WorkSpaceCacheService } from './WorkspaceCacheService';

export const SERVICES_CLASS_REGISTRY: InjectionToken<any>[] = [
  VscodeContextService,
  WorkSpaceCacheService,
  GitService,
  GitRepositoryService,
  GitRepositoryTravelService,
  SettingsService,
  FeatureManagerService,
  GitRepositoriesActionsService,
  GitRepositoriesBranchService,
];
