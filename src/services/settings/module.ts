import { ModuleRegistry } from '@wroud/di';
import { SettingsService } from './SettingsService.js';

ModuleRegistry.add({
  name: 'git-workspace-helper-settings-services',
  async configure(serviceCollection) {
    serviceCollection.addTransient(SettingsService);
  },
});
