import 'reflect-metadata';
import vscode from 'vscode';
import { DIContainerService } from './DI/DIContainer.js';
import { FeatureManagerService } from './services/features/FeatureManagerService.js';
import { VscodeContextService } from './services/base/VscodeContextService.js';

const diContainerService = new DIContainerService();

export function activate(context: vscode.ExtensionContext) {
  if (!vscode.workspace.workspaceFolders?.length) {
    return;
  }

  VscodeContextService.context = context;

  diContainerService.run();

  const featureManagerService =
    diContainerService.getByClassName<FeatureManagerService>(
      FeatureManagerService
    );

  featureManagerService.register();
}

export async function deactivate() {
  diContainerService.dispose();
}
