import './services/base/module.js';
import './services/git/module.js';
import './services/settings/module.js';
import './services/features/module.js';
import './services/ui/module.js';

import vscode from 'vscode';
import { ModuleRegistry, ServiceContainerBuilder } from '@wroud/di';
import { IExtensionContext } from './IExtensionContext.js';
import { CommandService } from './services/base/CommandService.js';
import {
  getDependenciesGraph,
  ServiceCollectionProxy,
} from '@wroud/di-tools-analyzer';
export async function activate(context: vscode.ExtensionContext) {
  if (!vscode.workspace.workspaceFolders?.length) {
    return;
  }

  const builder = new ServiceContainerBuilder();

  builder.addSingleton(IExtensionContext, () => context);

  for (const module of ModuleRegistry) {
    await module.configure(builder);
  }

  const serviceProvider = builder.build();

  const builderProxy = new ServiceCollectionProxy(builder);
  const data = JSON.stringify(
    await getDependenciesGraph(builder, builderProxy)
  );
  await vscode.env.clipboard.writeText(data);

  for (const subscription of serviceProvider.getServices(CommandService)) {
    await subscription.activate();
  }

  context.subscriptions.push({
    dispose: () => serviceProvider[Symbol.asyncDispose](),
  });
}

export async function deactivate(context: vscode.ExtensionContext) {
  context.subscriptions.forEach((subscription) => {
    if (typeof subscription.dispose === 'function') {
      subscription.dispose();
    }
  });
}
