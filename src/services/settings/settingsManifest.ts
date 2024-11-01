import { IManifest } from '../../types/IManifest.js';
import { SettingsService } from './SettingsService.js';

export const SETTINGS_MANIFEST: IManifest = [[SettingsService, 'singleton']];
