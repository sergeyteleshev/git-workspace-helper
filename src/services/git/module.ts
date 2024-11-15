import { ModuleRegistry } from '@wroud/di';
import { GitRepositoriesService } from './GitRepositoriesService.js';
import { GitService } from './GitService.js';
import { SimpleGitRepositoriesService } from './SimpleGitRepositoriesService.js';

ModuleRegistry.add({
  name: 'git-workspace-helper-git-services',
  async configure(serviceCollection) {
    serviceCollection.addSingleton(GitRepositoriesService);
    serviceCollection.addTransient(GitService);
    serviceCollection.addTransient(SimpleGitRepositoriesService);
  },
});
