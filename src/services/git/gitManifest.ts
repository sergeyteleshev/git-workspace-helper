import { IManifest } from '../../types/IManifest.js';
import { GitRepositoriesService } from './GitRepositoriesService.js';
import { GitRepositoryService } from './GitRepositoryService.js';
import { GitService } from './GitService.js';

export const GIT_MANIFEST: IManifest = [
  [GitRepositoriesService, 'singleton'],
  [GitRepositoryService, 'transient'],
  [GitService, 'transient'],
];
