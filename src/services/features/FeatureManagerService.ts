import vscode from 'vscode';
import { pull } from '../../features/pull';
import { discardChanges } from '../../features/discardChanges';
import { checkout } from '../../features/checkout';
import { merge } from '../../features/merge';
import { commit } from '../../features/commit';
import { push } from '../../features/push';
import { stageChanges } from '../../features/stageChanges';
import { unstageChanges } from '../../features/unstageChanges';
import { configureActiveRepositories } from '../../features/configureActiveRepositories';
import { FeatureAction } from '../../types/feature';
import { injectable } from 'tsyringe';

const ACTIONS: [string, FeatureAction][] = [
  ['git-workspace-helper.checkout', checkout],
  ['git-workspace-helper.pull', pull],
  ['git-workspace-helper.merge', merge],
  ['git-workspace-helper.discardChanges', discardChanges],
  ['git-workspace-helper.stageChanges', stageChanges],
  ['git-workspace-helper.unstageChanges', unstageChanges],
  ['git-workspace-helper.commit', commit],
  ['git-workspace-helper.push', push],
  [
    'git-workspace-helper.configureActiveRepositories',
    configureActiveRepositories,
  ],
];

@injectable()
export class FeatureManagerService {
  constructor() {
    this.register = this.register.bind(this);
  }

  register(context: vscode.ExtensionContext) {
    ACTIONS.forEach(([command, action]) => {
      context.subscriptions.push(
        vscode.commands.registerCommand(command, () => action(context))
      );
    });
  }
}
