import { createService } from '@wroud/di';
import { ExtensionContext } from 'vscode';

export type IExtensionContext = ExtensionContext;
export const IExtensionContext =
  createService<IExtensionContext>('IExtensionContext');
