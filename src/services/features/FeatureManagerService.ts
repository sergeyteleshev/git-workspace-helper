import vscode from 'vscode';
import { travel } from '../../features/travel';
import { travelToMaster } from '../../features/travelToMaster';
import { pull } from '../../features/pull';
import { discardChanges } from '../../features/discardChanges';

const ACTIONS: [string, () => void][] = [
  ['workspaces-time-travel-machine.travel', travel],
  ['workspaces-time-travel-machine.travel-to-master', travelToMaster],
  ['workspaces-time-travel-machine.pull', pull],
  ['workspaces-time-travel-machine.discardChanges', discardChanges],
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
