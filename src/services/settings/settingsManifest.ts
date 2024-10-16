import { IManifest } from '../../types/IManifest.js';
import { SettingsService } from './SettingsService.js';

export const SERVICES_MANIFEST: IManifest = [[SettingsService, 'singleton']];
