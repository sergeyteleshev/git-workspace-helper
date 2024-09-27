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
  ['workspace-git-helper.checkout', checkout],
  ['workspace-git-helper.pull', pull],
  ['workspace-git-helper.merge', merge],
  ['workspace-git-helper.discardChanges', discardChanges],
  ['workspace-git-helper.stageChanges', stageChanges],
  ['workspace-git-helper.unstageChanges', unstageChanges],
  ['workspace-git-helper.commit', commit],
  ['workspace-git-helper.push', push],
  [
    'workspace-git-helper.configureActiveRepositories',
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
