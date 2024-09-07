import vscode from 'vscode';
import { pull } from '../../features/pull';
import { discardChanges } from '../../features/discardChanges';
import { travel } from '../../features/travel';
import { merge } from '../../features/merge';
import { commit } from '../../features/commit';
import { push } from '../../features/push';

const ACTIONS: [string, () => void][] = [
  ['workspace-time-travel-machine.travel', travel],
  ['workspace-time-travel-machine.pull', pull],
  ['workspace-time-travel-machine.merge', merge],
  ['workspace-time-travel-machine.discardChanges', discardChanges],
  ['workspace-time-travel-machine.commit', commit],
  ['workspace-time-travel-machine.push', push],
];

export class FeatureManagerService {
  constructor() {
    this.register = this.register.bind(this);
  }

  register(context: vscode.ExtensionContext) {
    ACTIONS.forEach(([command, action]) => {
      context.subscriptions.push(
        vscode.commands.registerCommand(command, action)
      );
    });
  }
}
