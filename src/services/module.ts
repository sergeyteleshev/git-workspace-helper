import { ModuleRegistry } from '@wroud/di';
import { ExtensionSubscription } from './base/ExtensionSubscription.js';
import { IManifest } from '../types/IManifest.js';
import { BASE_MANIFEST } from './base/baseManifest.js';
import { FEATURES_MANIFEST } from './features/featuresManifest.js';
import { GIT_MANIFEST } from './git/gitManifest.js';
import { SETTINGS_MANIFEST } from './settings/settingsManifest.js';

const MANIFESTS: IManifest[] = [
  BASE_MANIFEST,
  FEATURES_MANIFEST,
  GIT_MANIFEST,
  SETTINGS_MANIFEST,
];

ModuleRegistry.add({
  name: 'git-workspace-helper-services',
  async configure(serviceCollection) {
    MANIFESTS.forEach((manifest) => {
      manifest.forEach(([service, type]) => {
        if (type === 'singleton') {
          serviceCollection.addSingleton(service);
        }

        if (type === 'transient') {
          serviceCollection.addTransient(service);
        }
      });
    });

    FEATURES_MANIFEST.forEach(([service, type]) => {
      if (type === 'singleton') {
        serviceCollection.addSingleton(ExtensionSubscription, (provider) =>
          provider.getService(service)
        );
      }

      if (type === 'transient') {
        serviceCollection.addTransient(ExtensionSubscription, (provider) =>
          provider.getService(service)
        );
      }
    });
  },
});
