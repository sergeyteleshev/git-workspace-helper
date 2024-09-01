import 'reflect-metadata';
import * as vscode from 'vscode';
import { DIContainerService } from './DI/DIContainer';
import { FeatureManagerService } from './services/features/FeatureManagerService';

const diContainerService = new DIContainerService();

export function activate(context: vscode.ExtensionContext) {
  diContainerService.run();
  const featureManagerService =
    diContainerService.getByClassName<FeatureManagerService>(
      FeatureManagerService
    );

  featureManagerService.register(context);
}

export async function deactivate() {
  diContainerService.dispose();
}
