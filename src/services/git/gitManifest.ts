import { IManifest } from '../../types/IManifest.js';
import { GitRepositoriesService } from './GitRepositoriesService.js';
import { GitService } from './GitService.js';

export const GIT_MANIFEST: IManifest = [
  [GitRepositoriesService, 'singleton'],
  [GitService, 'transient'],
];
