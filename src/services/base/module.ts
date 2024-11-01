import { ModuleRegistry } from '@wroud/di';
import { WorkspaceCacheService } from './WorkspaceCacheService.js';

ModuleRegistry.add({
  name: 'git-workspace-helper-base-services',
  async configure(serviceCollection) {
    serviceCollection.addSingleton(WorkspaceCacheService);
  },
});
