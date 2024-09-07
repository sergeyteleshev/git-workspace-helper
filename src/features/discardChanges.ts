import { DIContainerService } from '../DI/DIContainer';
import { GitRepositoriesService } from '../services/git/GitRepositoriesService';
import vscode from 'vscode';

export async function discardChanges() {
  const diContainerService = new DIContainerService();
  const gitRepositoriesService =
    diContainerService.getByClassName<GitRepositoriesService>(
      GitRepositoriesService
    );

  const shouldDelete = await vscode.window.showQuickPick(['Yes', 'No'], {
    title: 'Discard changes',
    placeHolder: 'All of the changes will be removed. Are you sure?',
  });

  if (shouldDelete === 'Yes') {
    gitRepositoriesService.discardChanges();
  }
}
