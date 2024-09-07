import { InjectionToken } from 'tsyringe';
import { GitService } from './git/GitService';
import { GitRepositoryService } from './git/GitRepositoryService';
import { GitRepositoryTravelService } from './git/GitRepositoryTravelService';
import { SettingsService } from './settings/SettingsService';
import { FeatureManagerService } from './features/FeatureManagerService';
import { GitRepositoriesService } from './git/GitRepositoriesService';

export const SERVICES_CLASS_REGISTRY: InjectionToken<any>[] = [
  GitService,
  GitRepositoryService,
  GitRepositoryTravelService,
  SettingsService,
  FeatureManagerService,
  GitRepositoriesService,
];
