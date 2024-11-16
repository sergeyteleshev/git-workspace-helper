import { ModuleRegistry } from '@wroud/di';
import { PickRepositoriesService } from './PickRepositoriesService.js';
import { PickStashService } from './PickStashService.js';

ModuleRegistry.add({
  name: 'git-workspace-helper-ui-services',
  async configure(serviceCollection) {
    serviceCollection.addTransient(PickRepositoriesService);
    serviceCollection.addTransient(PickStashService);
  },
});
