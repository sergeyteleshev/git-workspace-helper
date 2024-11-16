import { ModuleRegistry } from '@wroud/di';
import { PickRepositoriesService } from './PickRepositoriesService.js';
import { PickStashService } from './PickStashService.js';

ModuleRegistry.add({
  name: 'git-workspace-helper-ui-services',
  async configure(serviceCollection) {
    serviceCollection.addSingleton(PickRepositoriesService);
    serviceCollection.addSingleton(PickStashService);
  },
});
