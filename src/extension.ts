import 'reflect-metadata';
import vscode from 'vscode';
import { DIContainerService } from './DI/DIContainer';
import { FeatureManagerService } from './services/features/FeatureManagerService';
import { VscodeContextService } from './services/VscodeContextService';

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
